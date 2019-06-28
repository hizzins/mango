const webpack = require('webpack');
// 파일 생성 관련
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 코드 압축 관련
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { getAbsPath, rootPath, srcPath, publicPath, deployPath } = require('./path');

module.exports = {
  mode: 'production',

  // 일반 사용자를 위해 소스 맵 파일에 대한 액세스를 허용하지 않도록 서버를 구성해야합니다!
  // 원본 맵 파일을 웹 서버에 배포하면 안됩니다. 대신 오류보고 도구로만 사용하십시오.
  devtool: 'none', // hidden-source-map

  entry: [
    "@babel/polyfill",
    srcPath + '/index.js'
  ],

  output: {
    path: deployPath,
    filename: 'bundle.js'
  },

  // 상대 경로 보완
  resolve: {
    alias: {
      components: srcPath + '/components',
      contents: srcPath + '/contents',
      pages: srcPath + '/pages'
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  "@babel/preset-env",
                  {
                    "useBuiltIns": "usage"
                  },
                ],
                '@babel/preset-react'
              ],
              plugins: [
                "@babel/plugin-syntax-object-rest-spread",      // ES2018
                "@babel/plugin-transform-async-to-generator",   // ES2017
                ["@babel/plugin-proposal-class-properties", { "loose": true }]      // 실험적
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              //url: false, // url false하면 빌드 디렉토리에 폰트가 생성되지 않는다.
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // http://localhost:9001/public/service/dist-react/{outputPath}
              outputPath: 'img/', // 개발 버전의 절대 경로와 맞춰 파일을 생성한다.
              publicPath: '/playground/img/', // for JSX에서 불리는 이미지는 절대 경로를 잡아야 한다 or CDN
              name: '[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|otf)$/,
        exclude: /noto-sans/, // Production 에서 폰트는 common > css를 로드하기 때문에 별도로 빌드하지 않는다
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'contents/font/', // 개발 버전의 절대 경로와 맞춰 파일을 생성한다.
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  // 최적화
  optimization: {
    minimizer: [
      new UglifyJsPlugin({ cache: true, parallel: true, sourceMap: true }),
      new OptimizeCSSAssetsPlugin()
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['/*'], {
      root: deployPath,
      verbose: true // Write logs to console.
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.Quill': 'quill'
    })
  ]
};
