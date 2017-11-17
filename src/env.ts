// Simple wrapper exposing environment variables to rest of the code.

let jetpack = require('fs-jetpack');

// The variables have been written to `env.json` by the build process.

export default function() :any {
    let env = jetpack.cwd(__dirname).read('env.json', 'json');
    return env;
}
