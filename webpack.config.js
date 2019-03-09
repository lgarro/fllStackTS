const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const buildPath = path.resolve(__dirname, 'dist');
const clientPath = path.resolve(srcPath, './client');
const serverPath = path.resolve(srcPath, './api');

const plugins = [
  new HtmlWebpackPlugin({
    template: `${clientPath}/index.html`,
    title: 'Typescript node react',
    filename: './index.html',
    alwaysWriteToDisk: true
  })
];

const clientConfig = {
  target: 'web',
  mode: 'development',
  entry: {
    app: ['./src/client/App.tsx', 'webpack-hot-middleware/client'],
    vendor: ['react', 'react-dom']
  },
  output: {
    path: `${buildPath}/public`,
    filename: 'js/[name].bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    port: 3001,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    hot: true,
    progress: true,
    stats: { colors: true },
    proxy: [
      // allows redirect of requests to webpack-dev-api to another destination
      {
        context: ['/api'], // can have multiple
        target: 'http://localhost:3000', // api and port to redirect to
        secure: false
      }
    ],
    overlay: true
    // inline: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|jsx|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: 'url-loader?limit=10000'
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'client', 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
const apiConfig = {
  target: 'node',
  mode: 'development',
  entry: {
    app: ['./src/api/server.ts']
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  output: {
    path: buildPath,
    filename: 'app-bundle.js'
  }
};

module.exports = [clientConfig, apiConfig];
