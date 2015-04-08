import highlight from '../utils/highlight';
import * as chalk from 'chalk';
import walk from './walk';
import Scope from './Scope';

function getName ( node ) {
	return node.name;
}

export default function attachScopes ( ast, source ) {
	let scope = new Scope();

	function addToScope ( declarator ) {
		scope.addDeclaration( declarator );
	}

	walk( ast, {
		enter ( node, parent ) {
			if ( Array.isArray( node.body ) ) {
				let previousEnd = node.type === 'BlockStatement' ? node.start + 1 : node.start;

				node.body.forEach( child => {
					child.previousEnd = previousEnd;
					previousEnd = child.end;
				});
			}

			switch ( node.type ) {
				case 'FunctionExpression':
				case 'FunctionDeclaration':
				case 'ArrowFunctionExpression':
					if ( node.id ) {
						scope.addDeclaration( node );
					}

					scope = node._scope = new Scope({
						parent: scope,
						params: node.params
					});

					break;

				case 'BlockStatement':
					scope = node._scope = new Scope({
						parent: scope,
						isBlock: true
					});

					break;

				case 'VariableDeclaration':
					let previousEnd = node.declarations[0].start;
					node.declarations.forEach( declarator => {
						declarator.previousEnd = previousEnd;
						scope.addVariableDeclarator( declarator, node, node.kind !== 'var' );

						previousEnd = declarator.end;
					});
					break;

				case 'ClassExpression':
				case 'ClassDeclaration':
					addToScope( node );
					break;
			}
		},

		leave ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			}
		}
	});

	ast._scope = scope;

	return ast;
}