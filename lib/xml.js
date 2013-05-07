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

var inflect = require('i')(),
	model = require('./model');

var pack, packArray, packHash, packString, packNumber, packDate;

pack = function(data, key) {
	if (Array.isArray(data))
		return packArray(data, key);
	else if (data instanceof Date)
		return packDate(data, key);
	else if (typeof data == "object")
		return packHash(data, key);
	else if (typeof data == "string")
		return packString(data, key);
	else if (typeof data == "number" || data === false || data === true)
		return packNumber(data, key);
	else
		return "";
};

packArray = function(data, key) {
	var result = key ? ("<" + inflect.pluralize(key) + " type=\"array\">") : "<nil-classes type=\"array\">";
	for (var i = 0; i < data.length; i++) {
		result += pack(data[i], key ? inflect.singularize(key) : "item");
	}
	if (key) result += "</" + inflect.pluralize(key) + ">"
	else result += "</nil-classes>";
	return result;
};

packHash = function(data, key) {
	var result = key ? ("<" + inflect.singularize(key) + ">") : (Object.keys(data).length > 1 ? "<hash>" : "");
	for (var k in data) {
		result += pack(data[k], k);
	}
	if (key) result += "</" + inflect.singularize(key) + ">";
	else if (Object.keys(data).length > 1) result += "</hash>";
	return result;
};

packString = function(data, key) {
	var result = key ? ("<" + inflect.singularize(key) + ">") : "<string>";
	if (data.indexOf('<') >= 0 || data.indexOf('&') >= 0)
		result += '<![CDATA[' + data.replace(/\]\]>/g, ']]]]><![CDATA[>') + ']]>';
	else
		result += data;
	if (key) result += "</" + inflect.singularize(key) + ">";
	else result += "</string>";
	return result;
};

packNumber = function(data, key) {
	var type = (data === false || data === true) ? "boolean" : (data === +data && data !== (data | 0)) ? "float" : "integer";
	var result = key ? ("<" + inflect.singularize(key) + " type=\"" + type + "\">") : "<number type=\"" + type + "\">";
	result += data;
	if (key) result += "</" + inflect.singularize(key) + ">";
	else result += "</number>";
	return result;
};

packDate = function(data, key) {
	var result = key ? ("<" + inflect.singularize(key) + " type=\"datetime\">") : "<date type=\"datetime\">";
	result += data.toISOString();
	if (key) result += "</" + inflect.singularize(key) + ">";
	else result += "</date>";
	return result;
};

module.exports = function(data, options, callback) {
	if (arguments.length == 2 && typeof arguments[1] == 'function') {
		callback = arguments[1];
		options = {};
	}else if (arguments.length == 1) {
		callback = function() {};
		options = {};
	}
	model.flatten(data, options, 'xml', function(err, result) {
		if (err)
			callback(err);
		else
			callback(null, pack(result));
	});
};
