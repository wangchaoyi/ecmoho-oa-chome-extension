///<reference path="../../node_modules/@types/chrome/index.d.ts" />

import { E_DOMAIN, E_URL, EMessageEvent } from "./enums";
import Tab = chrome.tabs.Tab;
import InjectDetails = chrome.tabs.InjectDetails;
import Port = chrome.runtime.Port;

class Main {
  constructor() {
    console.log("hello, extension");

    this.initContextMenu();

    chrome.runtime.onMessage.addListener(function(message) {
      console.warn(message);
      // Handle message.
      // In this example, message === 'whatever value; String, object, whatever'
    });

    chrome.runtime.onConnect.addListener((port: Port) => {
      console.log(port);
    });
  }

  static findTab(url: E_URL): Promise<Tab[]> {
    return new Promise(resolve => {
      chrome.tabs.query(
        {
          url
        },
        resolve
      );
    });
  }

  static executeScript(tabId: number, details: InjectDetails): Promise<any[]> {
    return new Promise(resolve => {
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
        Main.findTab(E_URL.XINRENXINREN).then(([tab]) => {
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
      onclick: () => {
        console.log("fuck");
        Main.handleGetCheckIn.call(this);
      }
    });
  }

  static async handleGetCheckIn() {
    console.warn("fuck");
    let [tab] = await Main.findTab(E_URL.XINRENXINREN);
    if (tab) {
      const tabId: number = tab.id as number;

      await Main.executeScript(tabId, {
        code: `window.chrome_extension_id="${chrome.runtime.id}"`
      });

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
