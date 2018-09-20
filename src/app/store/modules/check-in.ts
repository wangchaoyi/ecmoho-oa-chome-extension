import { action, observable } from "mobx";
import { ICheckInRecord } from "../../types/interface";
import moment, { Moment } from "moment";

export class CheckInStore {
  @observable data: ICheckInRecord[] = [];
  @observable date: Moment = moment();

  @action
  setData(data: ICheckInRecord[]) {
    this.data = data;
  }

  @action
  setDate(date: Moment) {
    this.date = date;
  }
}

export default new CheckInStore();
