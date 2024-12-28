const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = () => {
  return {
    mode: "development",
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      // HTML Webpack Plugin to generate the index.html file
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "PWA App",
      }),

      // Workbox InjectManifest to inject the service worker into the build
      new InjectManifest({
        swSrc: "./src-sw.js", // Path to your custom service worker file
        swDest: "service-worker.js", // Output path for the service worker
      }),

      // PWA Manifest to generate the manifest.json file
      new WebpackPwaManifest({
        name: "My PWA App",
        short_name: "PWA",
        description: "A Progressive Web App",
        background_color: "#ffffff",
        theme_color: "#000000",
        start_url: ".",
        display: "standalone",
        icons: [
          {
            src: path.resolve("src/images/icon.png"),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"),
          },
        ],
      }),
    ],
    module: {
      rules: [
        // CSS loaders to handle CSS files
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        // Babel loader to transpile JavaScript
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
  };
};
