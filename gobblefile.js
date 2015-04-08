var gobble = require( 'gobble' );

module.exports = gobble( 'src' )
	.transform( 'babel', {
		whitelist: [
			'es6.arrowFunctions',
			'es6.blockScoping',
			'es6.classes',
			'es6.constants',
			'es6.destructuring',
			'es6.parameters.default',
			'es6.parameters.rest',
			'es6.properties.shorthand',
			'es6.templateLiterals'
		],
		sourceMap: true
	})
	.transform( 'esperanto-bundle', {
		entry: 'agadoo',
		type: 'umd',
		name: 'agadoo',
		strict: true,
		sourceMap: true
	})
	.transform( 'sorcery' );