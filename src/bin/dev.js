#!/usr/bin/env node

var chalk = require('chalk');
var watch = require('../webpack/watch.js').default;
var webpackSharedConfig = require('../webpack/webpack.shared.config.js').default;

var options = webpackSharedConfig({
    nodeEnv: process.env.NODE_ENV
});

console.log(chalk.green('Running project in watch mode with pwln'));

watch(options);
