import { action, computed, observable, observe } from "mobx";
import { IApprove } from "../../types/interface";
import * as services from "../../services";
import { APPROVE_STATUS } from "../../types/enum";
import { default as moment, Moment } from "moment";

/**
 * 审批列表
 */
export class ApproveStore {

  @observable public data: IApprove[] = [];

  @observable
  private pagination = {
    page: 0,
    perPage: 100
  };

  constructor() {
    this.initData();
  }

  @action
  set(data: IApprove[]) {
    this.data = data;
  }

  @computed
  public get done() {
    return this.data.filter(e => e.status === APPROVE_STATUS.SUCCESS);
  }

  @computed
  public get wait() {
    return this.data.filter(e => e.status === APPROVE_STATUS.WAIT);
  }

  @computed
  public get reverse() {
    return this.data.filter(e => e.status === APPROVE_STATUS.REVERSE);
  }

  @computed
  public get reject(){
    return this.data.filter(e => e.status === APPROVE_STATUS.REJECT)
  }

  public refresh() {
    this.initData();
  }

  private initData() {
    services
      .getApproveList({
        page: this.pagination.page + 1,
        pn: this.pagination.perPage
      })
      .then(res => {
        this.set(res.data);
      });
  }

  /**
   * 判断是否填写过申请
   */
  public hasApprove(date: Moment): boolean{
    return this.data.some(e => {
      return moment(parseInt(e.meta.start_date)*1000).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    })
  }

}

export default new ApproveStore();
