import * as React from "react";
import { addApproveStore, approveStore } from "../../store";
import { weekToChinese } from "../../utils";
import { ICheckInRecord } from "../../types/interface";
import { history } from "../../router";
import { FLOW_TYPE } from "../../types/enum";

export default [
  {
    title: "日期",
    key: "date",
    dataIndex: "date",
    width: 150,
    sorter: (a: ICheckInRecord, b: ICheckInRecord) => {
      return a.date > b.date ? 1 : -1;
    },
    render(date: string) {
      return <span>{date}</span>;
    }
  },
  {
    title: "星期",
    key: "week",
    width: 150,
    filters: [
      {
        text: "星期一",
        value: "1"
      },
      {
        text: "星期二",
        value: "2"
      },
      {
        text: "星期三",
        value: "3"
      },
      {
        text: "星期四",
        value: "4"
      },
      {
        text: "星期五",
        value: "5"
      },
      {
        text: "星期六",
        value: "6"
      },
      {
        text: "星期天",
        value: "0"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      return record.week === parseInt(value);
    },
    render(data: ICheckInRecord) {
      return <span>{weekToChinese(data.week)}</span>;
    }
  },
  {
    title: "法定工作日",
    key: "isWorkDay",
    width: 150,
    filters: [
      {
        text: "是",
        value: "true"
      },
      {
        text: "否",
        value: "false"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      return String(record.isWorkDay) === value;
    },
    render(data: ICheckInRecord) {
      return <span>{data.isWorkDay ? "是" : "-"}</span>;
    }
  },
  {
    title: "签到",
    key: "signInAt",
    width: 150,
    render(data: ICheckInRecord) {
      if (data.signInAt && data.signInAt.valueOf() === 0) {
        return <span>-</span>;
      }
      return <span>{data.signInAt && data.signInAt.format("HH:mm")}</span>;
    }
  },
  {
    title: "签退",
    key: "signOutAt",
    width: 150,
    render(data: ICheckInRecord) {
      if (data.signOutAt && data.signOutAt.valueOf() === 0) {
        return <span>-</span>;
      }
      return <span>{data.signOutAt && data.signOutAt.format("HH:mm")}</span>;
    }
  },
  {
    title: "餐补",
    key: "hasFoodSubsidy",
    width: 150,
    dataIndex: "hasFoodSubsidy",
    filters: [
      {
        text: "餐补",
        value: "true"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      if (!record.overtime) return false;
      if (record.isWorkDay) {
        return String(record.overtime.hour >= 1) === value;
      } else {
        return String(record.overtime.hour >= 4) === value;
      }
    },
    render(hasFoodSubsidy: boolean) {
      return <span>{hasFoodSubsidy ? "有" : "-"}</span>;
    }
  },
  {
    title: "加班",
    key: "status",
    width: 150,
    filters: [
      {
        text: "加班",
        value: "true"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      return String(Boolean(record.overtime)) === value;
    },
    render(data: ICheckInRecord) {
      if (data.overtime) {
        return <span>{data.overtime.hour}</span>;
      } else if (data.signInAt && data.signInAt.valueOf() === 0) {
        return <span>-</span>;
      } else {
        return <span>-</span>;
      }
    }
  },
  {
    title: "加班申请",
    key: "action",
    filters: [
      {
        text: "可申请",
        value: "0"
      },
      {
        text: "已申请",
        value: "1"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      if (value === "0") {
        return (
          (record.overtime &&
            !approveStore.hasApprove(record.overtime.startTime)) ||
          false
        );
      } else if (value === "1") {
        return (
          (record.overtime &&
            approveStore.hasApprove(record.overtime.startTime)) ||
          false
        );
      } else {
        return false;
      }
    },
    render: (data: ICheckInRecord) => {
      if (data.overtime && approveStore.hasApprove(data.overtime.startTime)) {
        return <span>已申请</span>;
      }

      const go = () => {
        if (!data.overtime) {
          return;
        }
        addApproveStore.set({
          start_date: data.overtime.startTime.format(),
          end_date: data.overtime.endTime.format(),
          flow_type: FLOW_TYPE.OVERTIME,
          overtime_hour: (data.overtime && data.overtime.hour) || 0,
          reason: "",
          custom_field: "[]",
          overtime_compensation_rule: 1
        });
        history.push("/approve/add/overtime");
      };
      return (
        <span>
          {data.overtime && (
            <a onClick={go} href="javascript:void(0)">
              申请加班
            </a>
          )}
          {/*<Divider type="vertical" />*/}
        </span>
      );
    }
  }
];
