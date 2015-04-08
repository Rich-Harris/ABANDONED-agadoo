#!/usr/bin/env node

var agadoo = require( '../' );

// TODO make this non-shitty

var input = require( 'fs' ).readFileSync( process.argv[2], 'utf-8' );
var output = agadoo.shake( input );
console.log( output.code );