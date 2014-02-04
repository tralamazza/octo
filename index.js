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
			cb = filters; // skip filters
		else if (filters)
			params = params.concat(encodeFilters(filters));
		var opt = {
			headers: { Accept: 'application/json' },
			url: url.format({
				protocol: 'https',
				host: 'octopart.com',
				pathname: apipath + path,
				search: params.join('&') + '&apikey=' + apikey
			})
		};
		return request.get(opt, cb ? function(err, res, body) {
			if (err)
				cb(err);
			else if (res.statusCode != 200)
				cb(new Error(JSON.parse(body).message));
			else
				cb(null, JSON.parse(body));
		} : null);
	};

	['brands', 'categories', 'parts', 'sellers'].forEach(function(name) {
		// uids = '2239e3330e2df5fe' or ['2239e3330e2df5fe', ...]
		// filters = response filters
		self[name + 'ByID'] = function(uids, filters, cb) {
			if (Array.isArray(uids)) {
				var params = [].concat(uids).map(function(uid) {
					return 'uid[]=' + uid;
				});
				return send(name + '/get_multi', params, filters, cb);
			} else
				return send(name + '/' + uids, [], filters, cb);
		};
		// args = {q: 'foobar'} or [{q: 'foobar'}, ...]
		// filters = response filters
		self[name + 'Search'] = function(args, filters, cb) {
			var params = [].concat(args).map(function(key) {
				return querystring.stringify(key);
			});
			return send(name + '/search', params, filters, cb);
		};
	});

	// args = { queries: [{...}, {...}], exact_only: true }
	// filters = response filters
	self.partsMatch = function(args, filters, cb) {
		var params = Object.keys(args).map(function(key) {
			return key + '=' + querystring.escape(JSON.stringify(args[key]));
		});
		return send('parts/match', params, filters, cb);
	};

	return self;
};

exports.createV3 = function(apikey) {
	return new OctoNode(apikey, '/api/v3/');
};
