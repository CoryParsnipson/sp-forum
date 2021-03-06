var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
   mode: "development",
   context: __dirname,
   entry: {
      main: './src/index.js',
   },
   output: {
      path: path.resolve('../backend/webpack_bundles'),
      filename: argv.mode == "development" ? "[name]-[hash].dev.js" : "[name].js",
      libraryTarget: 'var',
      library: 'forum_js'
   },
   plugins: [
      new BundleTracker({filename: '../backend/webpack_bundles/webpack-stats.json'}),
      new MiniCssExtractPlugin({
         filename: argv.mode == "development" ? "[name]-[hash].dev.css" : "[name].css",
      }),
   ],
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/i,
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
            test: /\.css$/i,
            exclude: /node_modules/,
            use: [
               'style-loader',
               'css-loader',
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     publicPath: (resourcePath, context) => {
                        // publicPath is the relative path of the resource to the context
                        // e.g. for ./css/admin/main.css the publicPath will be ../../
                        // while for ./css/main.css the publicPath will be ../
                        return path.relative(path.dirname(resourcePath), context) + '/';
                     }
                  }
               }
            ]
         },
         {
            test: /\.s[ac]ss$/i,
            exclude: /node_modules/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                     publicPath: (resourcePath, context) => {
                        // publicPath is the relative path of the resource to the context
                        // e.g. for ./css/admin/main.css the publicPath will be ../../
                        // while for ./css/main.css the publicPath will be ../
                        return path.relative(path.dirname(resourcePath), context) + '/';
                     }
                  }
               },
               'css-loader',
               'sass-loader',
            ]
         }
      ]
   },
   resolve: {
      extensions: ['*', '.js', '.jsx', '.css', '.scss']
   }
})
