import walk from './walk';

function isDeclaration ( node ) {
	return /Declarat(?:ion|or)$/.test( node.type );
}

export default function findDependants ( ast, source ) {
	let scope;

	walk( ast, {
		enter ( node, parent ) {
			if ( node._scope ) {
				scope = node._scope;
			}

			if ( node.type === 'Identifier' ) {
				if ( !isDeclaration( parent ) ) {
					scope.addDependant( node );
				}
			}
		},

		leave ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			}
		}
	});
}