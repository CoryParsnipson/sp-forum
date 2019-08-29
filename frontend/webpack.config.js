var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
   mode: "development",
   context: __dirname,
   entry: './src/index.js',
   output: {
      path: path.resolve('../backend/assets/js/webpack_bundles'),
      filename: "[name]-[hash].js",
   },
   plugins: [
      new BundleTracker({filename: './webpack-stats.json'})
   ],
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
               loader: 'babel-loader',
               options: {
                  presets: [
                     '@babel/preset-env',
                     '@babel/preset-react'
                  ]
               }
            }]
         },
         {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [ 'style-loader', 'css-loader' ]
         }
      ]
   },
   resolve: {
      extensions: ['*', '.js', '.jsx']
   }
}