#!/usr/bin/env node

var chalk = require('chalk');

// these are ES6 files so we need to require using the .default syntax
var build = require('../webpack/build.js').default;
var webpackSharedConfig = require('../webpack/webpack.shared.config.js').default;

const options = webpackSharedConfig({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
});

console.log(chalk.green('Building project with pwln'));
console.log(chalk.blue('Options:'), options);

build(options);
