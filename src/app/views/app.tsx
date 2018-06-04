/// <reference path="./types.ts" />

import * as React from "react";
import {Col, Divider, Icon, Menu, Table } from "antd";
// import styles from "./app.scss";
import moment from "dayjs";
import { calcWeek, weekToChinese } from "../utils";
import { IWeek } from "../interface";

const columns = [
  {
    title: "日期",
    key: "date",
    render(data: ICheckRecord) {
      return <>{data.date}</>;
    }
  },
  {
    title: "星期",
    key: "week",
    render(data: ICheckRecord) {
      return <>{weekToChinese(data.week)}</>;
    }
  },
  {
    title: "法定工作日",
    key: "isWorkDay",
    render(data: ICheckRecord) {
      return <>{data.isWorkDay ? "是" : "-"}</>;
    }
  },
  {
    title: "签到",
    key: "signInAt",
    render(data: ICheckRecord) {
      if (data.signInAt === 0) {
        return <>-</>;
      }
      return <>{moment(data.signInAt as number).format("hh:mm")}</>;
    }
  },
  {
    title: "签退",
    key: "signOutAt",
    render(data: ICheckRecord) {
      if (data.signOutAt === 0) {
        return <>-</>;
      }
      return <>{moment(data.signOutAt as number).format("hh:mm")}</>;
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <span>
        <a href="">Action</a>
        <Divider type="vertical" />
        <a href="">Delete</a>
        <Divider type="vertical" />
        <a href="" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    )
  }
];

export default class App extends React.Component {
  data = convertData();

  render() {
    return (
      <Col span={18} push={3}>
        <br />
        <h3>Test</h3>
        <br />
        <br />

        <Table columns={columns} dataSource={this.data} />
      </Col>
    );
  }
}

interface ICheckRecord {
  date: string;
  week: IWeek;

  /**
   * 是否为工作日
   */
  isWorkDay: boolean;
  signInAt: number | null; // 13位时间戳
  signOutAt: number | null;
  status: any;

  /**
   * 是否加班
   */
  isOvertime?: boolean;
  overtime?: number;

  /**
   * 餐补
   */
  hasFoodSubsidy?: boolean;
}

function convertData(): ICheckRecord[] {
  const data = require("../data.json");
  const list: ICheckRecord[] = [];
  data.data.records.forEach((e: any) => {
    if (!e.signTimeList) {
      return;
    }

    let newData = {
      date: (() => {
        let ym = data.data.attendance_md.yearmo;
        ym = `${ym.substr(0, 4)}/${ym.substr(4, 2)}/${
          e.date < 10 ? "0" + e.date : e.date
        }`;
        return ym;
      })(),
      week: 0 as IWeek,
      isWorkDay: Boolean(e.is_workday),
      signInAt:
        e.signTimeList &&
        e.signTimeList[0] &&
        e.signTimeList[0].clockTime * 1000,
      signOutAt:
        e.signTimeList &&
        e.signTimeList[1] &&
        e.signTimeList[1].clockTime * 1000,
      status: ""
    };

    Object.assign(newData, {
      week: calcWeek(moment(newData.date).format("YYYY/MM/DD")) as IWeek
    });

    if (newData.isWorkDay) {
    }

    list.push(newData);
  });
  return list;
}
