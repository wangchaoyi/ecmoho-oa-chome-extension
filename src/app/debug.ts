/**
 * 浏览器接受来自文件改变的时候进行刷新
 * @author 冷色的咖啡
 */
import { DEBUG_SERVER_PORT } from "./config";


if(process.env.NODE_ENV === "development"){

  const socketIO = require("socket.io-client");
  const socket = socketIO(`http://localhost:${DEBUG_SERVER_PORT}`);
  socket.on("connect", function() {});
  socket.on("refresh", function(data: any) {
    location.reload();
  });
  socket.on("disconnect", function() {});

}
