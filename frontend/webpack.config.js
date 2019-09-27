var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
   mode: "development",
   context: __dirname,
   entry: {
      base: './src/index_base.js',
      editor: './src/index_editor.js',
   },
   output: {
      path: path.resolve('../backend/assets/webpack_bundles'),
      filename: "[name]-[hash].js",
   },
   plugins: [
      new BundleTracker({filename: './webpack-stats.json'}),
      new MiniCssExtractPlugin({
         filename: '[name]-[hash].css',
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
}
