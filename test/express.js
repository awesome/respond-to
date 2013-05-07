/*
 * Copyright (C) 5/7/13, Tim van Elsloo
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

var express = require('express'),
	app = express(),
	http = require('http'),
	vows = require('vows'),
	assert = require('assert'),
	msgpack = require('msgpack'),
	respondTo = require('../lib/respond-to');

var simple = {
	id: 1,
	name: {
		firstname: "Tim",
		surname: "van Elsloo"
	}
};

app.get('/', function(req, res) {
	res.send('hello world');
});

app.get('/static.xml', function(req, res) {
	respondTo.xml("abc", function(err, data) {
		res.send(data);
	});
});

app.get('/static.json', function(req, res) {
	respondTo.json("abc", function(err, data) {
		res.send(data);
	});
});

app.get('/static.msg', function(req, res) {
	respondTo.msg("abc", function(err, data) {
		res.send(data);
	});
});

app.get('/dynamic.:format?', function(req, res) {
	respondTo(res, "abc");
});

app.listen(3000);

var request = function(url, headers, callback) {
	var options = require('url').parse(url);
	options.headers = headers;
	http.get(options, function(res) {
		var data = [];
		res.on('data', function(buffer) {
			data.push(buffer);
		});
		res.on('end', function() {
			callback(null, Buffer.concat(data));
		});
	});
};

module.exports = vows.describe('express').addBatch({
	'when running express': {
		topic: function() {
			request("http://localhost:3000/", {}, this.callback);
		},
		
		'we get a valid response': function(topic) {
			assert.equal(topic.toString(), "hello world");
		}
	},
	'when requesting some xml': {
		topic: function() {
			request("http://localhost:3000/static.xml", {}, this.callback);
		},
		
		'we get a valid xml response': function(topic) {
			assert.equal(topic.toString(), "<string>abc</string>");
		}
	},
	'when requesting some json': {
		topic: function() {
			request("http://localhost:3000/static.json", {}, this.callback);
		},
		
		'we get a valid json response': function(topic) {
			assert.equal(topic.toString(), JSON.stringify("abc"));
		}
	},
	'when requesting some msgpack': {
		topic: function() {
			request("http://localhost:3000/static.msg", {}, this.callback);
		},
		
		'we get a valid msgpack response': function(topic) {
			assert.deepEqual(msgpack.pack("abc"), topic);
		}
	},
	'when requesting some xml using a header': {
		topic: function() {
			request("http://localhost:3000/dynamic", {
				"Accept": "application/xml"
			}, this.callback);
		},
		
		'we get a valid xml response': function(topic) {
			assert.equal(topic.toString(), "<string>abc</string>");
		}
	},
	'when requesting some json using a header': {
		topic: function() {
			request("http://localhost:3000/dynamic", {
				"Accept": "application/json"
			}, this.callback);
		},
		
		'we get a valid json response': function(topic) {
			assert.equal(topic.toString(), JSON.stringify('abc'));
		}
	},
	'when requesting some msgpack using a header': {
		topic: function() {
			request("http://localhost:3000/dynamic", {
				"Accept": "application/x-msgpack"
			}, this.callback);
		},
		
		'we get a valid msgpack response': function(topic) {
			assert.deepEqual(msgpack.pack('abc'), topic);
		}
	},
	'when requesting some xml using a format param': {
		topic: function() {
			request("http://localhost:3000/dynamic.xml", {}, this.callback);
		},
		
		'we get a valid xml response': function(topic) {
			assert.equal(topic.toString(), "<string>abc</string>");
		}
	},
	'when requesting some json using a format param': {
		topic: function() {
			request("http://localhost:3000/dynamic.json", {}, this.callback);
		},
		
		'we get a valid json response': function(topic) {
			assert.equal(topic.toString(), JSON.stringify('abc'));
		}
	},
	'when requesting some msgpack using a format param': {
		topic: function() {
			request("http://localhost:3000/dynamic.msg", {}, this.callback);
		},
		
		'we get a valid msgpack response': function(topic) {
			assert.deepEqual(msgpack.pack('abc'), topic);
		}
	},
	'when requesting some xml using a format query param': {
		topic: function() {
			request("http://localhost:3000/dynamic?format=xml", {}, this.callback);
		},
		
		'we get a valid xml response': function(topic) {
			assert.equal(topic.toString(), '<string>abc</string>');
		}
	},
	'when requesting some json using a format query param': {
		topic: function() {
			request("http://localhost:3000/dynamic?format=json", {}, this.callback);
		},
		
		'we get a valid json response': function(topic) {
			assert.equal(topic.toString(), JSON.stringify('abc'));
		}
	},
	'when requesting some msgpack using a format query param': {
		topic: function() {
			request("http://localhost:3000/dynamic?format=msg", {}, this.callback);
		},
		
		'we get a valid msgpack response': function(topic) {
			assert.deepEqual(topic, msgpack.pack('abc'));
		}
	}
});

