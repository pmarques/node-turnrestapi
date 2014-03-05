"use strict";

var crypto = require('crypto');
var Store = require( './lib/redis' );
var keys = require( './lib/keys' );

var SEP = keys.SEP;

var DEFAULT_TTL = 86400;

function TURN_REST_API( conf ) {

	var ttl = conf.ttl || DEFAULT_TTL;

	var store = new Store( {
		redis : conf.db,
		ttl   : ttl
	});

	function getTurn( username ) {
		/* Define expiration timestamp */
		var timestamp = Math.floor( Date.now() / 1000 ).toString();
		username = username ? timestamp + SEP + username : timestamp;

		var csk = store.getCurrentSharedKey();
		var hash = keys.genSharedKey( username, csk );

		var result = {
			username : username,
			password : hash,
			ttl      : ttl,
			uris     : conf.urls
		};

		return result;
	}

	this.getTurn = getTurn;

};

module.exports = TURN_REST_API;
