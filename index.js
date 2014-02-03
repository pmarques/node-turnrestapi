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

module.exports = {
	genLongTermKey : genLongTermKey,
	genSharedKey : genSharedKey,
}
