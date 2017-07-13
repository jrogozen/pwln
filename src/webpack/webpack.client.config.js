import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import prettyjson from 'prettyjson';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import { CheckerPlugin } from 'awesome-typescript-loader';

export default function webpackClientConfig(options) {
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
        resolveLoader
    } = options;

    const plugins = [
        // create a separate vendor.js bundle on output that includes packages imported from node_modules
        // add a chunkhash to the filename for cache busting (eg: vendor-029192849.js)
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[chunkhash].js',
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),

        // create a separate manifest.js bundle on output that gives instructions on how to read the various output chunks
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),

        // create an assets.json file on output that has a map of the filenames/location of built files, including their hashes
        // eg: { vendor: { js: <path>/vendor-029192849.js } }
        // this is so we can include the script links to built js/css files when we generate HTML
        new AssetsPlugin({
            filename: 'assets.json',
            path: paths.clientOutput,
            prettyPrint: true,
            includeManifest: 'manifest',
            metadata: {
                publicPath
            }
        }),

        // extract out required css into a single chunkhashed file
        new ExtractTextPlugin({
            filename: isDev ? '[name].css' : '[name]-[chunkhash].css',
            allChunks: true
        }),

        // polyfill for native promises
        new webpack.ProvidePlugin({
            'Promise': 'native-promise-only'
        }),

        // expose variables available in project
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            __CLIENT__: true,
            __SERVER__: false,
            __DEV__: isDev,
            __PRODUCTION__: !isDev
        }),

        // used to report async errors (webpack in --watch mode)
        // https://github.com/s-panferov/awesome-typescript-loader
        new CheckerPlugin()
    ];

    if (!isDev) {
        plugins.push(
            new UglifyJsPlugin()
        );
    }

    const clientOptions = {
        target: 'web',

        devtool: devTool,

        entry: {
            index: paths.clientIndex
        },

        performance,

        output: {
            path: paths.clientOutput,
            pathinfo: true,

            // js bundle that contains code from all entry points + webpack runtime
            // include chunkhash for versioning/cache busting
            filename: isDev ? '[name].js' : '[name]-[chunkhash].js',

            chunkFilename: '[name]-[chunkhash].js',

            publicPath
        },

        resolve: {
            modules: ['node_modules'],
            extensions: resolveExtensions,
            alias: resolveAlias
        },

        resolveLoader: {
            modules: resolveLoader
        },

        module: {
            rules: [
                babelLoader,
                inlineSvgLoader,
                urlLoader,
                tsxLoader,
                {
                    test: /\.s?css$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            { loader: 'css-loader?minimize' },
                            {
                                loader: 'postcss-loader'
                            },
                            { loader: 'sass-loader' }
                        ]
                    })
                },
            ]
        },

        plugins
    };

    console.log(prettyjson.render(clientOptions));

    return clientOptions;
};
