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

var json = require('./json'),
	msgpack = require('./msgpack'),
	xml = require('./xml');

module.exports = function(format, data, options, callback) {
	if (!callback && typeof options == "function") callback = options;
	if (!options || typeof options == "function") options = {};
	if (typeof format == "object") {
		var onComplete = function(err, data) {
			if (callback) callback(err, data)
			else format.send(data);
		};
		if (format.req.params.format == 'xml' || (!format.req.params.format && format.req.query.format == 'xml')) {
			xml(data, options, onComplete);
		}else if (format.req.params.format == 'json' || (!format.req.params.format && format.req.query.format == 'json')) {
			json(data, options, onComplete);
		}else if (format.req.params.format == 'msg' || (!format.req.params.format && format.req.query.format == 'msg')) {
			msgpack(data, options, onComplete);
		}else {
			format.format({
				json: function() {
					json(data, options, onComplete);
				},
				xml: function() {
					xml(data, options, onComplete);
				},
				'application/x-msgpack': function() {
					msgpack(data, options, onComplete);
				}
			});
		}
	}else if (format == 'json')
		json(data, options, callback);
	else if (format == 'msg')
		msgpack(data, options, callback);
	else if (format == 'xml')
		msgpack(data, options, callback);
	else if (callback && typeof callback == 'function') {
		callback(new Error("Unrecognized format."));
	}
};

module.exports.json = json;
module.exports.msg = msgpack;
module.exports.xml = xml;
