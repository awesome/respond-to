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

var vows = require('vows'),
	assert = require('assert'),
	respondTo = require('../lib/respond-to');

module.exports = vows.describe('xml').addBatch({
	'when trying a simple string': {
		topic: function() {
			respondTo.xml("test", this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<string>test</string>");
		}
	},
	'when trying a simple integer': {
		topic: function() {
			respondTo.xml(10, this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<number type=\"integer\">10</number>");
		}
	},
	'when trying a simple float': {
		topic: function() {
			respondTo.xml(10.3, this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<number type=\"float\">10.3</number>");
		}
	},
	'when trying a simple boolean (true)': {
		topic: function() {
			respondTo.xml(true, this.callback)
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<number type=\"boolean\">true</number>");
		}
	},
	'when trying a simple boolean (false)': {
		topic: function() {
			respondTo.xml(false, this.callback)
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<number type=\"boolean\">false</number>");
		}
	},
	'when trying a simple date': {
		topic: function() {
			respondTo.xml(new Date(2012, 11, 21, 20, 00, 00), this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<date type=\"datetime\">2012-12-21T19:00:00.000Z</date>");
		}
	},
	'when trying a simple array': {
		topic: function() {
			respondTo.xml(["a", "b", "c"], this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<nil-classes type=\"array\"><item>a</item><item>b</item><item>c</item></nil-classes>");
		}
	},
	'when trying a simple hash': {
		topic: function() {
			respondTo.xml({'foo': 'bar'}, this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<foo>bar</foo>");
		}
	},
	"when trying a multidimensional array": {
		topic: function() {
			respondTo.xml(["a", ["b", "c"], "d"], this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<nil-classes type=\"array\"><item>a</item><items type=\"array\"><item>b</item><item>c</item></items><item>d</item></nil-classes>");
		}
	},
	"when trying a complex hash": {
		topic: function() {
			respondTo.xml({'foo': 'bar', 'bar': 'foo'}, this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.equal(topic, "<hash><foo>bar</foo><bar>foo</bar></hash>");
		}
	}
});
