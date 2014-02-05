var assert = require('assert'),
	turnapi = require( '../lib/keys' );

suite('Gen keys', function() {
	test('Generate long-term credential mechanism key for a user', function() {
		var expected = '7da2270ccfa49786e0115366d3a3d14d';
		var username = 'gorst',
		    realm = 'north.gov',
		    pass = 'hero'

		var result = turnapi.genLongTermKey( username, realm, pass );

		assert.equal( expected, result );
	});

	test('Generates password from Shared key', function() {
		var expected = 'zvcg5DAEySWJqZGpfm+Ds9LKepM=';
		var username = '1391454799:59488199',
		    shared_key = 'mySecrete1'

		var result = turnapi.genSharedKey( username, shared_key );

		assert.equal( expected, result );
	});
});
