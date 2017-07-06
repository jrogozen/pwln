import appRootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import { CheckerPlugin } from 'awesome-typescript-loader';

export default function webpackServerConfig(options) {
    const {
        nodeEnv,
        isDev,
        resolveAlias,
        publicPath,
        resolveExtensions,
        devTool,
        eslintLoader,
        babelLoader,
        urlLoader,
        performance,
        inlineSvgLoader,
        tsxLoader,
        paths,
        port
    } = options;

    const plugins = [

        // expose variables available in project
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.env.PORT': port,
            __CLIENT__: false,
            __SERVER__: true,
            __DEV__: isDev,
            __PRODUCTION__: !isDev
        }),

        // used to report async errors (webpack in --watch mode)
        // https://github.com/s-panferov/awesome-typescript-loader
        new CheckerPlugin()
    ];

    if (!isDev) {
        // minifies js
        plugins.push(new UglifyJsPlugin());
    }

    return {
        target: 'node',

        node: {
            __dirname: true,
            __filename: true
        },

        devtool: devTool,

        // only bundle things on this whitelist
        externals: nodeExternals({
            whitelist: [
                /\.(eot|woff|woff2|ttf|otf)$/,
                /\.(svg|png|jpg|jpeg|gif|ico)$/,
                /\.(mp4|mp3|ogg|swf|webp)$/,
                /\.(css|scss|sass|sss|less)$/
            ]
        }),

        performance,

        entry: {
            // the entry point for the server build
            // requires all subsequent files
            index: paths.serverIndex
        },

        // where webpack should output built files
        output: {
            path: paths.serverOutput,
            pathinfo: true,

            // how should webpack reference the built files
            publicPath,

            filename: '[name].js',
            libraryTarget: 'commonjs2'
        },

        resolve: {
            modules: ['node_modules'],
            extensions: resolveExtensions,
            alias: resolveAlias
        },

        // rules for what loaders should be used on various file types
        module: {
            rules: [
                babelLoader,
                inlineSvgLoader,
                urlLoader,
                tsxLoader,
                {
                    test: /\.s?css$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'css-loader?minimize' },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: { path: path.resolve(appRootDir.get(), 'node_modules/pwln/postcss.config.js') }
                            }
                        },
                        { loader: 'sass-loader' }
                    ]
                }
            ]
        },

        plugins
    };
};
