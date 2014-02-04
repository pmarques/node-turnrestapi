var redis = require( 'redis' ),
    util = require( 'util' );

function Redis( conf ) {
	var currentSharedKey = '';

	/*
	 * Get current shared key
	 */
	this.getCurrentSharedKey = function getCurrentSharedKey() {
		return currentSharedKey;
	};
}

module.exports = Redis;
