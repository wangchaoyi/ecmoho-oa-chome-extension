export type IWeek = 1 | 2 | 3 | 4 | 5 | 6 | 0;

/**
 * 传送给服务器的分页参数
 */
export interface IPageParams {
  page: number;
  /**
   * 每页数量
   */
  pn: number;
}

export interface IResponse<T> {
  code: number;
  data: T;
  message: string;
  status: true;
}

/**
 * 登录验证码获取
 */
export interface ILoginGetVerify {
  code_id: number;
}


/**
 * 审批
 */
export interface IApprove {

  /**
   * 事件id
   */
  processId: number;

  /**
   * 加班类型
   */
  flowType: number;
  flowTypeDesc: string;

  /**
   * 审批状态
   */
  status: number;
  statusDesc: string;

  applicationDatetime: string;

  /**
   * 申请时间
   */
  applicationTime: number;

  meta: {

    /**
     * 公司id
     */
    company_id: string;

    working_day: "0.0";

    /**
     * 申请理由
     */
    reason: string;

    first_id: null;

    approval_id: string;

    flow_type: string;

    leave_days: "0.0";
    total_day: "0.0";
    not_working_day: "0.0";
    already_leave_days: "0.00";
    calculate_rule: "0";

    /**
     * 加班有效开始时间(字符串时间戳)
     */
    start_date: string;

    /**
     * 加班有效结束时间(字符串时间戳)
     */
    end_date: string;

    /**
     * 申请类型描述。 例如： "加班"
     */
    flow_type_desc: string;

    /**
     * 补偿方法
     * 1: 调休
     */
    compensation_way: string;

    time_unit: "0";
    holiday_time_unit: "";
    image_path: "";

    /**
     * 申请的加班时间
     */
    overtime_hour: string;

    holiday_type_desc: "";

    /**
     * 员工id
     */
    employee_id: string;

    holiday_type: "0";
  };

  customField: "[]";
}
