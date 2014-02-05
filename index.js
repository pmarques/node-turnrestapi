"use strict";

var crypto = require('crypto');
var Store = require( './lib/redis' );
var keys = require( './lib/keys' );

var SEP = keys.SEP;

function TURN_REST_API( conf ) {

	var store = new Store( { redis : conf.db } );

	function getTurn( username ) {
		var csk = store.getCurrentSharedKey();
		var hash = keys.genSharedKey( username, csk );

		/* Define expiration timestamp */
		var timestamp = Math.floor( Date.now() / 1000 );
		username = username ? username + SEP + timestamp : timestamp;

		var result = {
			username : username,
			password : hash,
			ttl      : 86400,
			uris     : conf.urls
		};

		return result;
	}

	this.getTurn = getTurn;

};

module.exports = TURN_REST_API;
