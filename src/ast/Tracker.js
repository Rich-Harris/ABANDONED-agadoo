export class Tracker {
	constructor ( node, options = {} ) {
		this.node = node;
		this.dependants = [];

		this.isParameter = options.isParameter;
	}

	addDependant ( node ) {
		this.dependants.push( node );
	}

	removeDependant ( node ) {
		const index = this.dependants.indexOf( node );
		if ( !~index ) {
			throw new Error( 'strange' );
		}

		this.dependants.splice( index, 1 );
	}
}

export class VariableTracker {
	constructor ({ declarator, declaration }) {
		this.declarator = declarator;
		this.declaration = declaration;

		this.dependants = [];
	}

	addDependant ( node ) {
		this.dependants.push( node );
	}

	removeDependant ( node ) {
		const index = this.dependants.indexOf( node );
		if ( !~index ) {
			throw new Error( 'strange' );
		}

		this.dependants.splice( index, 1 );
	}
}