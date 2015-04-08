/*global describe, it, require */
var path = require( 'path' );
var assert = require( 'assert' );
var agadoo = require( '../dist/agadoo' );

describe( 'agadoo', function () {
	it( 'exists', function () {
		assert.ok( !!agadoo );
	});

	var sets = require( 'fs' ).readdirSync( path.join( __dirname, 'samples' ) )
		.map( function ( file ) {
			return {
				name: file.replace( /\.js$/, '' ),
				tests: require( path.join( __dirname, 'samples', file ) )
			};
		});

	sets.forEach( function ( set ) {
		describe( set.name, function () {
			set.tests.forEach( function ( test ) {
				( test.solo ? it.only : it )( test.title, function () {
					var before = test.before.replace( /\t{4}/g, '' ).trim();
					var after = test.after.replace( /\t{4}/g, '' ).trim();

					var result = agadoo.shake( before );

					assert.equal( result.code, after );
				});
			});
		});
	});
});