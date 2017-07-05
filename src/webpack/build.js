import webpack from 'webpack';
import webpackClientConfig from './webpack.client.config.js';
import webpackServerConfig from './webpack.server.config.js';

// expects options built from webpack.shared.config.js

console.log('build file~~~');

function build(options) {
    // you can pass multiple configs to webpack in an array to compile multiple builds
    // in this case we pass the server + client build configs
    const compiler = webpack([webpackClientConfig(options), webpackServerConfig(options)]);

    return compiler.run((err, stats) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(stats.toString({ colors: true }));
    });
}

export default build;
