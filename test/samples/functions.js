module.exports = [
	{
		title: 'removes unused function',
		before: `
			function foo () {}
			function bar () {}
			foo()`,
		after: `
			function foo () {}
			foo()`
	},

	{
		title: 'removes nested unused function',
		before: `
			function foo () {
				function baz () {}
			}
			foo()`,
		after: `
			function foo () {
			}
			foo()`
	},

	{
		title: 'preserves used function parameters that follow unused ones',
		before: `
			function foo ( x, y ) {
				console.log( y );
			}
			foo( 1, 2 );`,
		after: `
			function foo ( x, y ) {
				console.log( y );
			}
			foo( 1, 2 );`
	},

	{
		title: 'removes unused function parameters',
		before: `
			function foo ( x, y ) {
				console.log( x );
			}
			function bar ( x, y ) {
				console.log( 'neither x nor y' );
			}
			foo( 1 );
			bar();`,
		after: `
			function foo ( x ) {
				console.log( x );
			}
			function bar (  ) {
				console.log( 'neither x nor y' );
			}
			foo( 1 );
			bar();`,
	},

	{
		title: 'removes functions called by dead code',
		before: `
			function foo () {
				bar();
			}
			function bar () {}`,
		after: ''
	}
];