# agadoo

*[Ag-a-doo-doo-doo, push pineapple, shake the tree](https://www.youtube.com/watch?v=POv-3yIPSWc)*


## What is this?

An experiment. With the rise of ES6 modules, it becomes possible to *shake your tree* - to eliminate dead code from your application, even if it's buried in third party dependencies.

Minifiers already perform this step, to varying degrees of success, but my hunch is that a dedicated tool might be able to perform more aggressive (and configurable) optimisations. It's also potentially a great refactoring tool, as you can see exactly which bits of your own code are never getting called.


## Installation

Not yet. Like I said it's just an experiment. If it pans out, you'll be able to install it with `npm install agadoo`.


## Usage

This API may or may not have been implemented by the time you read this. It's aspirational. I'm practising [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

```js
import { shake } from 'agadoo'; // or var shake = require( 'agadoo' ).shake

var tree = fs.readFileSync( 'app.js', 'utf-8' );
var options = {
	/* don't know what these are yet */
};

var result = shake( code, options );

result.code;    // the compressed code
result.map;     // a sourcemap
result.removed; // an array of removed nodes
```


## License

MIT