var SEP = ':';

var crypto = require('crypto');

function genLongTermKey( username, realm, password ) {
	var md5 = crypto.createHash( 'md5' );

	var text = username + SEP + realm + SEP + password;
	md5.update( text );

	var hash = md5.digest( 'hex' );

	return hash;
}

function genSharedKey( username, shared_key ) {
	var hmac = crypto.createHmac( 'sha1', shared_key );

	hmac.update( username );

	var hash = hmac.digest( 'base64' );

	return hash;
}

var Store = require( './lib/redis' );
var store = new Store();
function getTurn( username ) {
	var csk = store.getCurrentSharedKey();
	var hash = genSharedKey( username, csk );

	/* Define expiration timestamp */
	var timestamp = Math.floor( Date.now() / 1000 );
	username = username ? username + SEP + timestamp : timestamp;

	var result = {
		username : username,
		password : hash,
		ttl      : 86400,
		uris     : [] //defaultConfs.turn_ips
	};

	return result;
}

module.exports = {
	genLongTermKey : genLongTermKey,
	genSharedKey : genSharedKey,
	getTurn : getTurn,
}
