module.exports = [
	{
		title: 'removes unused variable',
		before: `
			var a;`,
		after: ''
	},

	{
		title: 'leaves used variable',
		before: `
			var a;
			console.log( a );`,
		after: `
			var a;
			console.log( a );`
	},

	{
		title: 'removes unused variable and leaves used variable in same block',
		before: `
			var a, b;
			console.log( a );`,
		after: `
			var a;
			console.log( a );`
	},

	{
		title: 'removes unused variable and leaves used variable in same block, regardless of order',
		before: `
			var b, a;
			console.log( a );`,
		after: `
			var a;
			console.log( a );`
	}
];