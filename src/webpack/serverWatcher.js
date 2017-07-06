import appRootDir from 'app-root-dir';
import chalk from 'chalk';
import chokidar from 'chokidar';
import path from 'path';

const spawn = require('child_process').spawn;

let server;

function startNodeServer(callback) {
    let stopWatcher = false;

    console.log(chalk.green('Starting node server...'));

    server = spawn('node', ['dist/server/index.js']);

    // logs out things going to stdout, eg: console.log
    server.stdout.on('data', function(data) {
        process.stdout.write(data);
    });

    // logs out things going to stderr, eg: console.warn, errors
    server.stderr.on('data', function(data) {
        process.stdout.write(data);
    });

    // triggered by errors and our server.kill('SIGTERM') call below
    server.on('close', (code, signal) => {
        server = null;

        // on a critical error
        if (code === 1) {
            // set the parent's status
            callback(false);

            // set this level's status
            stopWatcher = true;
        }

        if (!stopWatcher) {
            server = startNodeServer(callback);
        }
    });

    return server;
}

function serverWatcher(callback) {
    // chokidar monitors for file changes at this glob
    const watcher = chokidar.watch(path.resolve(appRootDir.get(), './dist/server/*'));

    watcher.on('ready', () => {
        server = startNodeServer(callback);
    });

    // triggerd on file change
    watcher.on('change', (path, stats) => {
        console.log(chalk.red('Detected changes in dist/server, attempting to restart node server.'));

        if (server) {
            console.log(chalk.red('Killing old server...'));

            // sends a shut down call to the server (non error)
            server.kill('SIGTERM');
        }
    });

    watcher.on('error', error => console.log(chalk.red(`Watcher error: ${error}`)));

    // when we want to shut down the process, make sure it is shut down
    process.on('SIGINT', () => {
        process.exit(0);
    });

    return watcher;
}

export default serverWatcher;
