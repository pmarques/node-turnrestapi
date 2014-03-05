var assert = require('assert'),
    redis = require( 'node-redis-mock' ),
    TURN_REST_API = require( '../index' );
    keys = require( '../lib/keys' );

var redisConn = redis.createClient();
var RedisStore = require( '../lib/redis' );
var redisStore = new RedisStore({
	redis : redisConn
});
var turnapi = new TURN_REST_API({
	db : redisConn,
	urls: []
});

suite('HTTP REST API', function() {
	var _now;

	before( function() {
		/* Fake timestamp to test */
		_now = Date.now;
		Date.now = function() {
			return 1391515300000;
		}
	});

	after( function() {
		/* Remove fake timestamp from test */
		Date.now = _now;
		_now = undefined;
	});

	test('Generate answer with empty username', function() {
		var username = ''
		var expectedUsername = '1391515300';

		var shared_key = redisStore.getCurrentSharedKey();
		var pass = keys.genSharedKey( expectedUsername, shared_key );

		var expected = {
			username : expectedUsername,
			password : pass,
			ttl      : 86400,
			uris     : []
		}

		var result = turnapi.getTurn( username );

		assert.deepEqual( expected, result );
	});

	test('Generate answer', function() {
		var expectedUsername = '1391515300:1391454799';
		var username = '1391454799';

		var shared_key = redisStore.getCurrentSharedKey();
		var pass = keys.genSharedKey( expectedUsername, shared_key );

		var expected = {
			username : expectedUsername,
			password : pass,
			ttl      : 86400,
			uris     : []
		}

		var result = turnapi.getTurn( username );

		assert.deepEqual( expected, result );
	});
});
