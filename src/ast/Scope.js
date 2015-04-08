import highlight from '../utils/highlight';
import { Tracker, VariableTracker } from './Tracker';

export default class Scope {
	constructor ( options ) {
		options = options || {};

		this.parent = options.parent;
		this.children = [];

		//this.params = options.params || [];
		this.intermediate = [];

		this.declarations = {}; // all declarations, of any time

		this.parameterDeclarations = [];
		this.functionDeclarations = []; // includes functions and classes
		this.variableDeclarators = []; // includes var, let, const

		if ( options.params ) {
			options.params.forEach( param => {
				const tracker = new Tracker( param, {
					isParameter: true
				});

				this.declarations[ param.name ] = tracker;
				this.parameterDeclarations.push( tracker );
			});
		}


		if ( this.parent ) {
			this.parent.children.push( this );
		}
	}

	// add a function or class declaration
	addDeclaration ( node ) {
		const name = node.id.name;
		const tracker = new Tracker( node );

		this.functionDeclarations.push( tracker );
		this.declarations[ name ] = tracker;
	}

	// add a var, let, const declarator
	addVariableDeclarator ( declarator, declaration, isBlock ) {
		if ( isBlock && !this.isBlock ) {
			this.parent.addVariableDeclarator( declarator, declaration, isBlock );
			return;
		}

		const name = declarator.id.name;
		const tracker = new VariableTracker({ declarator, declaration });

		this.variableDeclarators.push( tracker );
		this.declarations[ name ] = tracker;
	}

	addDependant ( node ) {
		const name = node.name;

		if ( this.declarations.hasOwnProperty( name ) ) {
			this.declarations[ name ].addDependant( node );
		}

		else if ( this.parent ) {
			this.intermediate.push( node );
			this.parent.addDependant( node );
		}
	}

	removeDependant ( node ) {
		const name = node.name;

		if ( this.declarations.hasOwnProperty( name ) ) {
			this.declarations[ name ].removeDependant( node );
		}

		else if ( this.parent ) {
			this.intermediate.push( node );
			this.parent.removeDependant( node );
		}
	}

	find ( name ) {
		if ( this.declarations.hasOwnProperty( name ) ) {
			return this.declarations[ name ];
		}

		if ( this.parent ) {
			return this.parent.find( name );
		}

		return null;
	}

	clean ( body ) {
		let removedSomething = false;
		let i;
		let declaration; // should be block-scoped const, but jshint...
		let node; //ditto
		let tracker;

		// remove unused function parameters
		if ( this.parameterDeclarations ) {
			i = this.parameterDeclarations.length;
			while ( i-- ) {
				declaration = this.parameterDeclarations[i];

				if ( declaration.dependants.length > 0 ) {
					break;
				}

				const start = i > 0 ? this.parameterDeclarations[ i - 1 ].node.end : this.parameterDeclarations[i].node.start;
				body.remove( start, declaration.node.end );

				removedSomething = true;
				this.parameterDeclarations.pop();
			}
		}


		// remove function bodies
		i = this.functionDeclarations.length;
		while ( i-- ) {
			tracker = this.functionDeclarations[i];
			node = tracker.node;

			if ( !( 'previousEnd' in node ) ) {
				throw new Error( 'missing previousEnd' );
			}

			if ( tracker.dependants.length === 0 ) {
				// remove declaration
				body.remove( node.previousEnd, node.end );


				//if ( node._scope ) {
					node._scope.intermediate.forEach( node => {
						this.removeDependant( node );
					});
				//}

				removedSomething = true;
				this.functionDeclarations.splice( i, 1 );
			}
		}

		// remove variable declarators
		let affectedDeclarations = []; // TODO...

		i = this.variableDeclarators.length;
		while ( i-- ) {
			tracker = this.variableDeclarators[i];
			node = tracker.declarator;

			if ( !( 'previousEnd' in node ) ) {
				throw new Error( 'missing previousEnd' );
			}

			if ( tracker.dependants.length === 0 ) {
				// remove declaration
				body.remove( node.previousEnd, node.end );

				// mark the parent declaration as affected, so we can remove the
				// entire thing if it has no declarators remaining
				if ( !~affectedDeclarations.indexOf( tracker.declaration ) ) {
					affectedDeclarations.push( tracker.declaration );
				}

				const index = tracker.declaration.declarations.indexOf( node );
				if ( !~index ) {
					throw new Error( 'strange' );
				}
				tracker.declaration.declarations.splice( index, 1 );

				removedSomething = true;
				this.variableDeclarators.splice( i, 1 );
			}
		}

		affectedDeclarations.forEach( node => {
			if ( node.declarations.length === 0 ) {
				body.remove( node.previousEnd, node.end );
			}
		});

		// clean child scopes
		this.children.forEach( scope => {
			const childRemovedSomething = scope.clean( body );

			if ( childRemovedSomething ) {
				removedSomething = true;
			}
		});

		return removedSomething;
	}
}