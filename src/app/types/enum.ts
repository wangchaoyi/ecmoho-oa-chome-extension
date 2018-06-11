export enum FLOW_TYPE {
  OVERTIME = 9
}

export enum APPROVE_STATUS {
  /**
   * 申请撤销
   */
  REVERSE = 3,

  /**
   * 申请通过
   */
  SUCCESS = 1,

  /**
   * 审批中
   */
  WAIT = 0
}
