// webpack.dev.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// Merge (common config) rule
module.exports = merge(common, {
  mode: 'development',
  devtool: "eval-source-map",
  devServer: {
    // Additional files for reloading server
    watchFiles: ["./src/template.html"],
  },
});