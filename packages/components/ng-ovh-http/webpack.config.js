const webpack = require("webpack");
const path = require("path");

let config = {
    mode: "production",
    entry: "./src/ovh-angular-http.js",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "./ovh-angular-http.min.js"
    }
  }

module.exports = config;
