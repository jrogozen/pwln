import appRootDir from 'app-root-dir';
import fs from 'fs';
import path from 'path';

export function resolvePath(...paths) {
    return path.resolve(appRootDir.get(), ...paths);
}

export default {
    clientIndex: resolvePath('./app/client/index.js'),
    serverIndex: resolvePath('./app/server/index.js'),
    clientOutput: resolvePath('./dist/client'),
    serverOutput: resolvePath('./dist/server'),
    output: resolvePath('./dist'),
    app: resolvePath('./app'),
    scss: resolvePath('./scss'),
    shared: resolvePath('./app/shared'),
    client: resolvePath('./app/client'),
    server: resolvePath('./app/server'),
    images: resolvePath('./images'),
    config: resolvePath('./config'),
    test: resolvePath('./test'),
    dist: resolvePath('./dist'),
    public: resolvePath('./public')
};
