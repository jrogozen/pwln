import appRootDir from 'app-root-dir';
import path from 'path';

import paths from './paths';

export default function webpackSharedConfig(options) {
    const {
        // nodeEnv is the environment we are building for (production, development, ...)
        nodeEnv
    } = options;

    const isDev = nodeEnv !== 'production';

    // determines the type of source maps we want to generate. influences build/rebuild time.
    // https://webpack.js.org/configuration/devtool/
    const devTool = isDev ? 'cheap-module-eval-source-map' : 'hidden-source-map';

    // controls when webpack emits warnings for asset file-sizes
    const performance = isDev ? false : { hints: 'warning' };

    // the path to webpack's generated output. in production, this could point to a CDN
    const publicPath = '/dist/client/';

    // what file extensions should webpack automatically resolve?
    // eg: import myFile from './myFile.js' vs import myFile from './myFile'
    const resolveExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];

    const resolveLoader = [
        path.resolve(appRootDir.get(), './node_modules/pwln/node_modules'),
        'node_modules'
    ];

    // what aliases should be usable?
    // eg: import myFile from 'scss/myFile.scss' will reference paths.scss/myFile.scss
    const resolveAlias = {
        app: paths.app,
        scss: paths.scss,
        shared: paths.shared,
        client: paths.client,
        server: paths.server,
        images: paths.images,
        config: paths.config,
        test: paths.test,
        dist: paths.dist,
        public: paths.public

    };

    // run esLintLoader before webpack compiles
    const eslintLoader = {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
            failOnError: false,
            emitWarning: true,
            quiet: false,
            failOnWarning: false
        }
    };

    // js loader, ignore node_modules and .babelrc (use presets defined here)
    const babelLoader = {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015', 'react', 'stage-0'],
            babelrc: false
        }
    };

    const urlLoader = {
        test: /\.woff2?$|\.jpe?g$|\.ttf$|\.eot$|\.png$/,
        loader: 'url-loader?limit=3000&name=[name]-[sha512:hash:base64:7].[ext]'
    };

    const tsxLoader = {
        test: /\.tsx?$/,
        loader: 'babel-loader!awesome-typescript-loader'
    };

    const inlineSvgLoader = {
        test: /\.svg?$/,
        loader: 'svg-react-loader',
        exclude: /node_modules/
    };

    return {
        nodeEnv,
        isDev,
        resolveAlias,
        publicPath,
        resolveExtensions,
        devTool,
        performance,
        eslintLoader,
        babelLoader,
        urlLoader,
        inlineSvgLoader,
        resolveLoader,
        tsxLoader,
        paths
    };
};
