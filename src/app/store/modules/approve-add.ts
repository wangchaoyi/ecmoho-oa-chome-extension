import { observable } from "mobx";
import moment, { Moment } from "moment";
import { IApproveParams } from "../../types/interface";
import { FLOW_TYPE } from "../../types/enum";

export class AddApproveStore {
  @observable
  data: IApproveParams = {
    start_date: moment().format(),
    end_date: moment().format(),
    flow_type: FLOW_TYPE.OVERTIME,
    overtime_hour: 0,
    reason: "",
    custom_field: "[]",
    overtime_compensation_rule: 1
  };

  set(data: IApproveParams) {
    this.data = data;
  }

  reset(){
    this.data = {
      start_date: "",
      end_date: "",
      flow_type: FLOW_TYPE.OVERTIME,
      overtime_hour: 0,
      reason: "",
      custom_field: "[]",
      overtime_compensation_rule: 1
    };
  }

}

export default new AddApproveStore();
