/*
 * Copyright (C) 5/6/13, Tim van Elsloo
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
	model = require('../lib/model');

var simple = {
	id: 1,
	name: {
		firstname: "Tim",
		surname: "van Elsloo"
	}
};

module.exports = vows.describe('model').addBatch({
	'when flattening a simple model': {
		topic: function() {
			model.flatten(simple, {
				exclude: ['id']
			}, 'asJSON', this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.deepEqual({name: {firstname: "Tim", surname: "van Elsloo"}}, topic);
		}
	},
	'when flattening only certain variables of a model': {
		topic: function() {
			model.flatten(simple, {
				include: ['name.firstname']
			}, 'json', this.callback);
		},
		
		'we get a valid result': function(topic) {
			assert.deepEqual({name: {firstname: "Tim"}}, topic);
		}
	}
});
