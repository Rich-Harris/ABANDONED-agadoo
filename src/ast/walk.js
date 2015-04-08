export default function walk ( ast, { enter, leave }) {
	visit( ast, null, enter, leave );
}

let context = {
	skip: () => context.shouldSkip = true
};

let childKeys = {};

let toString = Object.prototype.toString;

function isArray ( thing ) {
	return toString.call( thing ) === '[object Array]';
}

function visit ( node, parent, enter, leave ) {
	if ( !node ) return;

	if ( enter ) {
		context.shouldSkip = false;
		enter.call( context, node, parent );
		if ( context.shouldSkip ) return;
	}

	let keys = childKeys[ node.type ] || (
		childKeys[ node.type ] = Object.keys( node ).filter( key => typeof node[ key ] === 'object' )
	);

	let key, value, i, j, len;

	i = keys.length;
	while ( i-- ) {
		key = keys[i];
		value = node[ key ];

		if ( isArray( value ) ) {
			len = value.length;
			for ( j = 0; j < len; j += 1 ) {
				visit( value[j], node, enter, leave );
			}
		}

		else if ( value && value.type ) {
			visit( value, node, enter, leave );
		}
	}

	if ( leave ) {
		leave( node, parent );
	}
}