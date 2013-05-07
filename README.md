# Respond-to
Respond-to is an asynchronous module for Node.js that aims to replicate RoR's
`respond_to` method. It comes with a XML formatter, it uses the built-in JSON
serializer and depends on the official msgpack module.

## Download
The source is available for download from
[GitHub](https://github.com/timvanelsloo/respond-to). Alternatively, you can
install using Node Package Manager (npm):

    npm install respond-to

## How to use
The easiest way to use respond-to is by calling the `respondTo`-function:

    var respondTo = require('respond-to');
    respondTo('xml', {
    	users: [
    		{
    			id: 1,
    			username: "Timvanelsloo"
    		}
    	]
    }, function(err, data) {
    	console.log(err, data);
    });

This is short for:

    respondTo.xml({
       ...
    }, function(err, data) {});

Currently supported formats are: `xml`, `json` and `msg` (msgpack).

### Serializing

Serializing by default is done by pulling all keys and values from an object.
You can override this behaviour by implementing an `as`-function with the
following prototype:

    Something.prototype.as = function(format, options, callback) {
    	
    };

The `format` variable contains any of the supported formats (as a string).
`options` contains a hash derived from the original `options` hash that was used
when calling `respondTo.*`. It also contains a function `include(key)`. You can
call that method in order to determine what keys should be returned and what
not. When you're done, you can call `callback(err, result)`. The result can be
any type of a serializable javascript object, and (when available) `as` gets
called for that object as well.

### Filtering

You can either filter by including, or by excluding certain keys. You should not
both include and exclude keys at the same time.

A great feature in filtering is the ability to filter multidimensional keys.

For example, when you define an object like this:

    {
        users: [
            {
                id: 1,
                name: {
                    first: "Tim",
                    last: "van Elsloo"
            	}
            }
        ]
    }

And filter it with these keys:

	{
		include: ['users.id', 'users.name.first']
	}

On a sidenote, these options can be inverted into:

	{
		exclude: ['users.name.last']
	}

This results in:

    {
    	users: [
    		{
    			id: 1,
    			name: {
    				first: "Tim"
    			}
    		}
    	]
    }

You also can prototype `users.name` to override `as(format, options, callback)`
with the following function:

    name.as = function(format, options, callback) {
    	if (options.include('first') && !options.include('last'))
    		return callback(null, this.first);
    	return {first: this.first, last: this.last};
    };

This replaces the `name`-hash with only the `first`-value:

	name: "Tim"

Please note that when you're only including certain keys, multi-dimensional keys
are flattened:

    ['users.name.first'] == ['users', 'users.name', 'users.name.first']

## Recommended: using it with Express 3.x
When you're using Express, you can also call `respondTo` with your response as
the first parameter:
	
	exports.index = function(req, res) {
	    respondTo(res, {
	        users: [
				{
					id: 1,
					username: "Timvanelsloo"
				}
			]
	    });
	}

Respond-to automatically determines the requested content-type in the following order:

1.	Check the query for a "format" parameter. This can be one of the supported
	formats (`xml`, `json` and `msg`). This *only* works when no
	`req.params.format` is set!
2.	Respond-to then checks for the `req.params.format`. Recommended: define a
	route as `"/users/all.:format?"`.
3.	Lastly, if none of the above steps resulted in a content-type, the `Accept`
	http header is used.
4.	Default: `json`.

## Documentation

### Express

- [respondTo(res, data, options = {}, callback = null)](#respondToReqDataOptionsCallback)

### Vanilla (without Express)

- [respondTo(format, data, options = {}, callback)](#respondToFormatDataOptionsCallback)
- [respondTo.json(data, options = {}, callback)](#respondTo_jsonDataOptionsCallback)
- [respondTo.msg(data, options = {}, callback)](#respondTo_msgDataOptionsCallback)
- [respondTo.xml(data, options = {}, callback)](#respondTo_xmlDataOptionsCallback)

## Express

<a id="respondToReqDataOptionsCallback"></a>
### respondTo(res, data, options = {}, callback = null)
This function aims at abstracting all serializing processes as much as possible.
The use of this function is very similar to `render` (except for that it isn't
an instance method).

#### Arguments
- res - An Express response. This always contains a reference to the original
  request so there's no need to explicitly include that.
- data - A serializable javascript object.
- options - Optional - The options-hash can be used for filtering keys.
- callback(err, data) - Optional - Note that when a callback is defined,
  `res.send(data)` is not called.

## Vanilla (without Express)

<a id="respondToFormatDataOptionsCallback"></a>
### respondTo(format, data, options = {}, callback)
You can use this function when you aren't using Express.

#### Arguments
- format - One of these: `"json"`, `"msg"` and `"xml"`.
- data - A serializable javascript object.
- options - Optional - The options-hash can be used for filtering keys.
- callback(err, data)
---
<a id="respondTo_jsonDataOptionsCallback"></a>
### respondTo.json(data, options = {}, callback)

#### Arguments
- data - A serializable javascript object.
- options - Optional - The options-hash can be used for filtering keys.
- callback(err, data)
---
<a id="respondTo_msgDataOptionsCallback"></a>
### respondTo.msg(data, options = {}, callback)

#### Arguments
- data - A serializable javascript object.
- options - Optional - The options-hash can be used for filtering keys.
- callback(err, data)
---
<a id="respondTo_xmlDataOptionsCallback"></a>
### respondTo.xml(data, options = {}, callback)

#### Arguments
- data - A serializable javascript object.
- options - Optional - The options-hash can be used for filtering keys.
- callback(err, data)
