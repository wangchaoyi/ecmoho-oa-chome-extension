import * as fs from "fs";
import * as path from "path";
import * as del from "del";
import * as fsExtra from "fs-extra";
import * as glob from "glob";


const releasePath = "./release";

function main() {
  if (fs.existsSync(releasePath)) {
    del.sync(releasePath);
  }
  fs.mkdirSync(releasePath);

  fs.copyFileSync(
    path.join(process.cwd(), "manifest.json"),
    path.join(process.cwd(), releasePath, "manifest.json")
  );

  copyDir("./build/app", path.join(releasePath, "app"));
  // copyDir("./build/extension", path.join(releasePath, "extension"));

  fs.writeFileSync(
    path.join(releasePath, "manifest.json"),
    fs
      .readFileSync(path.join(releasePath, "manifest.json"))
      .toString()
      .replace(/build\//g, "./")
  );

  glob(releasePath + "/**/*.map", (err, files) => {
    for(let file of files){
      fs.unlinkSync(file);
    }
  })

}

let copyDir = function(src, dest) {
  fs.mkdirSync(dest);
  let files = fs.readdirSync(src);
  for (let i = 0; i < files.length; i++) {
    let current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      let symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      fs.copyFileSync(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

main();
