const path = require("path");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {

  mode: "development",

  entry: {
    app: "./src/app/js/index.tsx"
  },

  output: {
    path: path.join(__dirname, './'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  plugins: [
    new TsconfigPathsPlugin({ configFile: "./src/app/tsconfig.json"  })
  ],

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.ts|tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.scss|css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        use: "url-loader?limit=50000"
      }
    ]
  },
  watch: true,
  devtool: 'source-map'
};