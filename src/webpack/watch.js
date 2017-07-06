import chalk from 'chalk';
import webpack from 'webpack';
import webpackClientConfig from './webpack.client.config.js';
import webpackServerConfig from './webpack.server.config.js';

// our node server start/stop functions
import serverWatcher from './serverWatcher.js';

function watch(options) {
    const compiler = webpack([webpackClientConfig(options), webpackServerConfig(options)]);

    let server;

    // serverWatcher.js needs to be able to tell watch.js (this file) if it should restart
    function setServer(bool) {
        server = bool;
    }

    // .watch will continually rebuild on file changes (vs. .run)
    compiler.watch({
        aggregateTimeout: 300
    }, (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }

        // only log webpack errors when watching
        console.log(stats.toString('errors-only'));

        if (!server) {
            setServer(true);

            console.log(chalk.green.bold('Starting node serverWatcher...'));

            serverWatcher(setServer);
        }
    });

}

export default watch;
