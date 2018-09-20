const webpack = require("webpack");
const HappyPack = require("happypack");
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: "development",

  entry: {
    app: "./src/app/index.tsx",
    debug: "./src/app/debug.ts"
  },

  output: {
    path: path.join(__dirname, "/build/app"),
    filename: "[name].js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"]
  },

  plugins: [

    // 打包模块体积分析
    // new BundleAnalyzerPlugin(),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),

    // 自定义tsconfig路径
    new TsconfigPathsPlugin({ configFile: "./src/app/tsconfig.json" }),

    // 开启新线程去进行类型检查
    new ForkTsCheckerWebpackPlugin({
      tsconfig: "./src/app/tsconfig.json",
      checkSyntacticErrors: true,
      async: true
    }),

    new HappyPack({
      id: "tsx",
      threads: 4,
      loaders: [
        {
          path: "ts-loader",
          query: { happyPackMode: true }
        }
      ],
      cache: true
    }),
    new HappyPack({
      id: "jsx",
      threads: 4,
      loaders: ["babel-loader"],
      cache: true
    }),
    new HappyPack({
      id: "scss",
      threads: 4,
      verbose: false,
      loaders: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: "[name]__[local]___[hash:base64:5]"
          }
        },
        "sass-loader"
      ],
      cache: true
    }),
    new HappyPack({
      id: "less",
      threads: 4,
      verbose: false,
      loaders: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName: "[name]__[local]___[hash:base64:5]"
          }
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }
      ],
      cache: true
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "async",
      // minSize: 30000,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: {
          // test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: ["happypack/loader?id=jsx"],
        exclude: /node_modules/
      },
      {
        test: /\.data\.json$/,
        use: ["json-loader"],
        type: "javascript/auto"
      },
      {
        test: /\.ts|tsx?$/,
        use: ["happypack/loader?id=tsx"]
      },
      {
        test: /\.scss$/,
        use: ["happypack/loader?id=scss"]
      },
      {
        test: /\.less$/,
        use: ["happypack/loader?id=less"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/,
        use: "url-loader?limit=50000"
      }
    ]
  },
  watch: true,
  devtool: "source-map"
};
