var assert = require('assert'),
	turnapi = require( '../index' );

suite('Gen keys', function() {
	test('Generate long-term credential mechanism key for a user', function() {
		var expected = '7da2270ccfa49786e0115366d3a3d14d';
		var username = 'gorst',
		    realm = 'north.gov',
		    pass = 'hero'

		var result = turnapi.genLongTermKey( username, realm, pass );

		assert.equal( expected, result );
	});
});
