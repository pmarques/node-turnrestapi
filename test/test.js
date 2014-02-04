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

	test('Generates password from Shared key', function() {
		var expected = 'zvcg5DAEySWJqZGpfm+Ds9LKepM=';
		var username = '1391454799:59488199',
		    shared_key = 'mySecrete1'

		var result = turnapi.genSharedKey( username, shared_key );

		assert.equal( expected, result );
	});
});

var RedisStore = require( '../lib/redis' );
var redisStore = new RedisStore();

suite('HTTP REST API', function() {
	var _now;

	before( function() {
		/* Fake timestamp to test */
		_now = Date.now;
		Date.now = function() {
			return 1391515300;
		}
	});

	after( function() {
		/* Remove fake timestamp from test */
		Date.now = _now;
		_now = undefined;
	});

	test('Generate answer', function() {
		var username = '1391454799'

		var shared_key = redisStore.getCurrentSharedKey();
		var pass = turnapi.genSharedKey( username, shared_key );

		var expected = {
			username : '1391454799:1391515300',
			password : pass,
			ttl      : 86400,
			uris     : []
		}

		var result = turnapi.getTurn( username );

		assert.deepEqual( expected, result );
	});
});
