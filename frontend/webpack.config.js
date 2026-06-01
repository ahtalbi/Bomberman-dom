const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app/app.js',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map', // helpful for debugging in devtools browser sitemap of js not single file
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              ["@babel/plugin-transform-react-jsx", {
                pragma: "createElement",
              }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
