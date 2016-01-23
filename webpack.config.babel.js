import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const APP_PATH = __dirname + '/src';

const config = {
  entry: [
    './src/index.scss',
    './src/index.js',
  ],
  output: {
    path: './dist',
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    root: APP_PATH,
    extensions: [
      '',
      '.js',
    ],
  },
  resolveLoader: {
    modulesDirectories: [ 'node_modules' ],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: '20000',
          name: 'assets/images/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
        query: {
          name: 'assets/fonts/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url',
        query: {
          name: 'assets/fonts/[name].[ext]?[hash]',
          limit: '20000',
          mimetype: 'application/font-woff',
        },
      },
    ],
  },
  postcss: () => [
    require('autoprefixer'),
    require('cssnano'),
  ],
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: true,
    }),
    new webpack.NoErrorsPlugin(),
  ]
}

if (process.env.NODE_ENV === 'production') {
  config.module.loaders = [
    ...config.module.loaders,
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css'),
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass!postcss'),
    },
  ];

  config.plugins = [
    new ExtractTextPlugin('assets/style.css', { allChunks: true }),
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
  ];
} else {
  config.module.loaders = [
    ...config.module.loaders,
    {
      test: /\.css$/,
      loaders: [
        'style',
        'css?sourceMap',
        'postcss?sourceMap',
      ],
    },
    {
      test: /\.scss$/,
      loaders: [
        'style',
        'css?sourceMap',
        'sass?sourceMap',
        'postcss?sourceMap',
      ],
    },
  ];
  config.devtool = '#source-map';
  config.debug = true;
  config.devServer = {
    contentBase: APP_PATH,
    //hot: true,
    inline: true,
    //historyApiFallback: true,
  }
}

export default config;
