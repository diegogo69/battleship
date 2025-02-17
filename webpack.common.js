// webpack.common.js

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    // Handling HTML
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      // Load CSS including img rules
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      // Load images on JavaScript via asset/resource rule
      {
        // Regex for file extension
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
