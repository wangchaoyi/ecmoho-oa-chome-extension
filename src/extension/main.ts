///<reference path="../../node_modules/@types/chrome/index.d.ts" />

import Tab = chrome.tabs.Tab;
import InjectDetails = chrome.tabs.InjectDetails;
import { EMessageEvent } from "./enums";

enum EURL {
  XINRENXINREN = "*://e.xinrenxinshi.com/*"
}

class Main {
  constructor() {
    console.log("hello, extension!");

    this.initContextMenu();

    chrome.runtime.onMessage.addListener(function(
      message,
    ) {
      console.warn(message);
      // Handle message.
      // In this example, message === 'whatever value; String, object, whatever'
    });
  }

  static findTab(url: EURL): Promise<Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query(
        {
          url
        },
        resolve
      );
    });
  }

  static executeScript(tabId: number, details: InjectDetails): Promise<any[]> {
    return new Promise((resolve) => {
      chrome.tabs.executeScript(tabId, details, resolve);
    });
  }

  /**
   * 初始化右键菜单
   */
  initContextMenu() {
    chrome.contextMenus.create({
      title: "初始化App",
      onclick: () => {
        Main.findTab(EURL.XINRENXINREN).then(([tab]) => {
          if (tab) {
            chrome.tabs.executeScript({
              file: "build/extension/inject.js"
            });
          } else {
            console.error("未找到标签");
          }
        });
      }
    });

    chrome.contextMenus.create({
      title: "获取打卡记录",
      onclick: Main.handleGetCheckIn.bind(this)
    });
  }

  static async handleGetCheckIn() {
    let [tab] = await Main.findTab(EURL.XINRENXINREN);

    if (tab) {
      const tabId: number = tab.id as number;

      await Main.executeScript(tabId, {
        code: `window.chrome_extension_id="${chrome.runtime.id}"`
      });

      console.log("next");

      await Main.executeScript(tabId, {
        file: "build/extension/inject.js"
      });

      await Main.executeScript(tabId, {
        code: ""
      });

      chrome.tabs.sendMessage(tabId, {
        type: EMessageEvent.REQUEST_CHECK_IN
      });
    }
  }
}

new Main();
