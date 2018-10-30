import * as fs from "fs";
import * as path from "path";

const buildPath = "./build/app";
const srcPath = "./src/app";

if(!fs.existsSync("./build")){
  fs.mkdirSync("./build");
}

if(!fs.existsSync(buildPath)){
  fs.mkdirSync(buildPath);
}

//
const initFileList = ["index.html", "icon.png", "logo.png"];
for(let file of initFileList){
  fs.copyFileSync(path.join(srcPath, file), path.join(buildPath, file));
}