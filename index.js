var request = require('request');
var url = require('url');
var querystring = require('querystring');


function flatten(arr) {
	var tmp = Array.prototype.concat.apply([], arr);
	return tmp.some(Array.isArray) ? flatten(tmp) : tmp;
}

/*	response filters
	filters = {
		show: ['field1', 'field2'],
		hide: ['field3'],
		slice: [
			{ field4: "1:5" },
			{ field5: "1:3" }
		]
	}*/
function encodeFilters(filters) {
	return flatten(Object.keys(filters).map(function(k) {
		var v = Array.prototype.concat.apply([], filters[k]);
		return v.map(function(vi) {
			if (vi instanceof Object)
				return Object.keys(vi).map(function(ki) {
					return k + '[' + ki + ']=' + querystring.escape(vi[ki]); // e.g. slice[field1]=1:5
				});
			else
				return k + '[]=' + querystring.escape(vi); // e.g. show[]=foo
		});
	}));
}

var OctoNode = function(apikey, apipath) {
	var self = this;

	var send = function(path, params, filters, cb) {
		if (typeof filters === 'function')
			cb = filters;
		else if (filters !== null && filters !== {})
			params = params.concat(encodeFilters(filters));
		var opt = {
			headers: { Accept: 'application/json' },
			jar: false, // no cookies
			method: 'GET',
			url: url.format({
				protocol: 'https',
				host: 'octopart.com',
				pathname: apipath + path,
				search: params.join('&') + '&apikey=' + apikey
			})
		};
		request(opt, function(err, res, body) {
			if (err)
				return cb(err);
			else if (res.statusCode != 200)
				return cb(new Error(JSON.parse(body).message));
			return cb(null, body);
		});
	};

	['brands', 'categories', 'parts', 'sellers'].forEach(function(name) {
		// uids = '2239e3330e2df5fe' or ['2239e3330e2df5fe', ...]
		// filters = response filters
		self[name + 'ByID'] = function(uids, filters, cb) {
			var params = [].concat(uids).map(function(uid) {
				return 'uid[]=' + uid;
			});
			send(name + '/get_multi', params, filters, cb);
		};
		// args = {q: 'foobar'} or [{q: 'foobar'}, ...]
		// filters = response filters
		self[name + 'Search'] = function(args, filters, cb) {
			var params = [].concat(args).map(function(key) {
				return querystring.stringify(key);
			});
			send(name + '/search', params, filters, cb);
		};
	});

	// args = { queries: [{...}, {...}], exact_only: true }
	// filters = response filters
	self.partsMatch = function(args, filters, cb) {
		var params = Object.keys(args).map(function(key) {
			return key + '=' + querystring.escape(JSON.stringify(args[key]));
		});
		send('parts/match', params, filters, cb);
	};

	return self;
};

exports.createV3 = function(apikey) {
	return new OctoNode(apikey, '/api/v3/');
};
