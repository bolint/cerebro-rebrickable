const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: './src/index'
  },
  output: {
    path: './dist',
    libraryTarget: 'commonjs2',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    }
  },
  target: 'electron-renderer',
  module: {
    rules: [{
      test: /\.json$/,
      use: {
        loader: 'json-loader'
      }
    }, {
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader'
      },
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        query: {
          modules: true
        }
      }]
    }, {
      test: /\.png$/,
      use: {
        loader: 'url-loader'
      }
    }]
  }
};