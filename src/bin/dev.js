#!/usr/bin/env node

var chalk = require('chalk');
var watch = require('../webpack/watch.js').default;
var webpackSharedConfig = require('../webpack/webpack.shared.config.js').default;

var options = webpackSharedConfig({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
});

console.log(chalk.green('Running project in watch mode with pwln'));
console.log(chalk.blue('Options:'), options);

watch(options);
