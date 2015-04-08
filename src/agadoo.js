import acorn from 'acorn';
import MagicString from 'magic-string';
import attachScopes from './ast/attachScopes';
import findDependants from './ast/findDependants';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

export function shake ( code, options ) {
	let ast = acorn.parse( code, {
		ecmaVersion: 6,
		sourceType: 'module'
	});

	attachScopes( ast, code );
	findDependants( ast, code );

	let body = new MagicString( code );
	let removedSomething;

	let safety = 10;

	do {
		removedSomething = ast._scope.clean( body );
	} while ( removedSomething && safety-- );

	if ( safety < 0 ) {
		throw new Error( 'infinite loop?' );
	}


	return {
		code: body.toString()
	};
}