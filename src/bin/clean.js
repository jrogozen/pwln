#!/usr/bin/env node

import shell from 'shelljs';

const targets = ['dist/client', 'dist/server'];

shell.echo('clean: removing targets:', targets);
shell.rm('-rf', targets);

shell.echo('clean: creating targets:', targets);
shell.mkdir('-p', targets);
