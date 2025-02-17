// webpack.prod.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// Merge (common config) rule
module.exports = merge(common, {
  mode: 'production',
});