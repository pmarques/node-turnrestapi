"use strict";

var redis = require( 'redis' ),
    util = require( 'util' );

var REDIS_SHARED_KEY_FORMAT = 'turn/secret/%s';

var DEFAULT_SHARED_KEY_TIMEOUT = 86400;

var DEFAULT_KEY_GEN = function() {
	return Math.floor( Math.random() * 1e10 ).toString();
}

function Redis( conf ) {
	conf = conf || {};

	var client = conf.redis || redis.createClient();

	var SharedKeyTimeout = conf.ttl || DEFAULT_SHARED_KEY_TIMEOUT;

	var NewKeyGenerator = conf.keyGen || DEFAULT_KEY_GEN;

	var factor = 2.1;

	var currentSharedKey = '';

	/*
	 * Get current shared key
	 */
	this.getCurrentSharedKey = function getCurrentSharedKey() {
		return currentSharedKey;
	};

	/**
	 * Insert a new shared key into Redis Store
	 *
	 * @param onSucc Success callback
	 */
	var newSharedKey = function newSharedKey( timestamp, onSucc ) {
		var pKey =  util.format( REDIS_SHARED_KEY_FORMAT, timestamp );
		var key = NewKeyGenerator();

		client.setnx( pKey, key, function( err, out )  {
			if( out === 1 ) {
				// If the key is set by me, set the expire time and use it
				client.expire( pKey, SharedKeyTimeout * factor);
				onSucc( key );
			} else {
				// If the key was set by someone else, get the key and and use it
				client.get( pKey, function( err, value ) {
					if( err )
						// TODO:
						throw new Error();

					onSucc( value );
				});
			}
		});
	};

	/*
	 * If not initalized, initialize the previous Shared Jey
	 */
	(function() {
		var ts = Math.floor( Date.now() / 1000 );
		ts = Math.floor(ts / SharedKeyTimeout) * SharedKeyTimeout;
		newSharedKey( ts, function( key )  {
			currentSharedKey = key;
		});

		ts += SharedKeyTimeout;
		var nextKeyTimout = ts - Math.floor( Date.now() / 1000 );
		setTimeout( function() {
			var cb = function( k ) {
				currentSharedKey = k;
			};
			newSharedKey( ts, cb );
			setInterval( function() {
				ts += SharedKeyTimeout;
				newSharedKey( ts, cb );
			}, SharedKeyTimeout * 1000 );
		}, nextKeyTimout * 1000 );
	})();
}

module.exports = Redis;
