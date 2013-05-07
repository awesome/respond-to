/*
 * Copyright (C) 5/5/13, Tim van Elsloo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var async = require('async');

var excluded = new Buffer(0);

function include(options, path) {
	if (options.include)
		return options.include.indexOf(path) >= 0;
	else if (options.exclude)
		return options.exclude.indexOf(path) < 0;
	return true;
}
 
function flatten(object, options, path, serializer, callback) {
	var process = function(err, object, filtered) {
		if (object instanceof Date) {
			callback(null, object);
			return;
		}
		if (Array.isArray(object)) {
			var process = function(data, cb) {
				flatten(data, options, path, serializer, cb);
			};
			async.mapSeries(object, process, function(err, results) {
				callback(err, results);
			});
		}else if (typeof object == 'object') {
			var process = function(key, data, cb) {
				var keypath = path.length > 0 ? [path, key].join('.') : key;
				if (include(options, keypath) || filtered)
					flatten(data, options, keypath, serializer, cb);
				else
					cb(null, excluded);
			};
			var functions = {};
			for (key in object) {
				functions[key] = function(key) {
					return function(cb) {
						process(key, object[key], cb);
					};
				}(key);
			}
			async.series(functions, function(err, result) {
				if (err) {
					callback(err);
				}else {
					for (key in result) {
						if (result[key] == excluded)
							delete result[key];
					}
					callback(null, result);
				}
			});
		}else callback(null, object);
	}
	var process2 = function(err, object) {
		process(err, object, true);
	};
	if (object.as) {
		var o = {
			filters: {
			}
		};
		if (options.include) {
			o.filters.include = [];
			for (var i = 0; i < options.include.length; i++) {
				if (options.include[i].length > path.length + 1)
					o.filters.include.push(options.include[i].substr(path.length + 1));
			}
		}
		if (options.exclude) {
			o.filters.exclude = [];
			for (var i = 0; i < options.exclude.length; i++) {
				if (options.exclude[i].length > path.length + 1)
					o.filters.exclude.push(options.exclude[i].substr(path.length + 1));
			}
		}
		o.include = function(key) {
			return include(o.filters, key);
		};
		object.as(serializer, o, process2);
	}else process(null, object);
};

exports.flatten = function(object, options, serializer, callback) {
	if (options.include) {
		var include = [];
		for (var i = 0; i < options.include.length; i++) {
			var components = options.include[i].split('.');
			for (var y = 0; y < components.length; y++) {
				var component = components.slice(0, y + 1).join('.');
				if (include.indexOf(component) < 0)
					include.push(component);
			}
		}
		options.include = include;
	}
	return flatten(object, options, '', serializer, callback);
};
