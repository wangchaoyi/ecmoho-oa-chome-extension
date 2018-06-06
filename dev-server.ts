/**
 * 开发服务器
 * 用途： 当页面刷新，触发chrome选项页面的自动刷新。
 * 为什么需要这个轮子，因为chrome插件里面的页面不允许加载远程代码，webpack-dev-server无法使用，用本地服务器又无法调用跨域接口。
 * @author 冷色的咖啡
 */

import * as fs from "fs";
import {exec, spawn, execSync, spawnSync} from "child_process";
import * as Events from "events";
import { DEBUG_SERVER_PORT } from "./src/app/config";
const Watch = require("glob-watcher");
const server = require("http").createServer();
const io = require("socket.io")(server);

// 同步src/app/index.html到build/app
fs.copyFileSync("src/app/index.html", "build/app/index.html");

// 启动webpack打包app
let sp = spawn("node", ["./node_modules/.bin/webpack", "--color" , "--config", "webpack.config.js"]);
sp.stdout.on("data", (data) => {
  console.log(data.toString());
});

// 监听打包文件修改
const events = new Events();
const watch = Watch(["./build/app/*.js"]);
watch.on("change", () => {
  console.log("file change");
  events.emit("app-change");
});

// 通知浏览器刷新
io.on("connection", function(client) {
  // console.log("new client is connect...");
  const cb = () => {
    client.emit("refresh", "gogogo...");
  };
  events.on("app-change", cb);
  client.on("disconnect", function() {
    // console.log("client is disconnect");
    events.removeListener("app-change", cb);
  });
});
server.listen(DEBUG_SERVER_PORT);
console.log(`socket server is on: ${DEBUG_SERVER_PORT}`);
