const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { srcPath, publicPath } = require('./path');

module.exports = {
  mode: 'development',

  //REF https://webpack.js.org/configuration/devtool
  //devtool: 'eval-source-map', // original source
  devtool: 'cheap-module-eval-source-map', // original source (lines only) 속도면에서 유리

  entry: {
    index: [
      "@babel/polyfill",
      srcPath + '/index.js'
    ]
  },

  output: {
    path: publicPath,
    filename: 'bundle.js',
    publicPath: '/'           // react hot loader 사용시 없으면 브라우저 reload된다.
  },

  // 상대 경로 보완
  resolve: {
    alias: {
      components: srcPath + '/components',
      containers: srcPath + '/containers',
      contents: srcPath + '/contents',
      pages: srcPath + '/pages',
      lib: srcPath + '/lib',
      store: srcPath + '/store'
    }
  },

  devServer: {
    hot: true,                 // 모듈만 체인지 (react-hot-loader 필요)
    inline: true,              // 핫 리로드 불가시 전체 번들링을 불러오기 위해 전체 리로딩 한다 include devServer to bundle
    //host: '0.0.0.0',
    port: 3003,
    proxy: {
        "**": "http://localhost:3004"
    },
    contentBase: publicPath + '/',
    // openPage: '/',
    historyApiFallback: true  // 리프레시 할때 404 대신 index페이지를 내려줘서 React라우터 사용시 필요하다.
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
                    "useBuiltIns": "usage",
                    "modules": false,  // react hot loader 사용시 modules false 필수
                    "debug": true
                  },
                ],
                '@babel/preset-react'
              ],
              plugins: [
                "@babel/plugin-syntax-object-rest-spread",      // ES2018
                "@babel/plugin-transform-async-to-generator",   // ES2017
                ["@babel/plugin-proposal-class-properties", { "loose": true }],      // 실험적
                "react-hot-loader/babel" // react-hot-loader은 수정시 state 유지 시켜준다.
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
          // 순서 바뀌면 안됨
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // 배포 빌드시 오류 발생하여 절대경로 지정하여 주석 처리함
              // includePaths: [srcPath + '/contents/scss']  // Component SCSS 내부에서 import시 사용하는 path설정.
            }
          },
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  // 최적화
  optimization: {
    // 캐시
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      chunks: ['vendors', 'index'],
      showErrors: true
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.Quill': 'quill'
    })
  ]
};
