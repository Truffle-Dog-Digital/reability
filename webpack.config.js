const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: ".", globOptions: { ignore: ["**/index.html"] } },
        { from: "manifest.json", to: "." },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.LEMLIST_API_KEY": JSON.stringify(
        process.env.LEMLIST_API_KEY
      ),
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
