import { EMessageEvent } from "./enums";
import { IDataCheckIn, IResponse } from "./interfaces";

const chrome_id: string = (<any>window)["chrome_extension_id"];

class App {
  constructor() {
    chrome.runtime.onMessage.addListener((message: IResponse<any>) => {
      console.log(`receive type: ${message.type}`);
      if (message.type === EMessageEvent.REQUEST_CHECK_IN) {
        this.getCheckIn().then(data => {
          chrome.runtime.sendMessage(chrome_id, data);
        });
      }
    });

    let btn = document.createElement("button");
    btn.classList.add("hello-extension");
    document.body.appendChild(btn);
    btn.onclick = event => {
      console.warn("I'm ready");
    };
  }

  getCheckIn(time: number = 201805): Promise<IResponse<IDataCheckIn>> {
    let formData = new FormData();
    formData.append("yearmo", time.toString());
    console.log(formData);
    return fetch("/attendance/ajax-get-attendance-record-list", {
      method: "POST",
      credentials: "include",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        return {
          type: EMessageEvent.REQUEST_CHECK_IN,
          data: data.data
        };
      });
  }
}

new App();
