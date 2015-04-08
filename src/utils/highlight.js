import * as chalk from 'chalk';

export default function highlight ( str, a, b ) {
	return str.slice( 0, a ) + chalk.inverse( str.slice( a, b ) ) + str.slice( b );
}