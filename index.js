var SEP = ':';

var crypto = require('crypto');

function genLongTermKey( username, realm, password ) {
	var md5 = crypto.createHash( 'md5' );

	var text = username + SEP + realm + SEP + password;
	md5.update( text );

	var hash = md5.digest( 'hex' );

	return hash;

	return;
}

module.exports = {
	genLongTermKey : genLongTermKey,
}
