/// <reference path="../../types.ts" />

import * as React from "react";
import { Col, Divider, Table, DatePicker, Row, Form, Tag, Tooltip } from "antd";
import styles from "../../assets/scss/app.scss";
import { default as moment, Moment } from "moment";
import {
  calcHasFoodSubsidy,
  calcOverTime,
  calcWeek,
  weekToChinese
} from "../../utils";
import { ICheckInRecord, IWeek } from "../../types/interface";
import * as services from "../../services";
import GlobalHeader from "../layout/global-header";
import { AddApproveStore, addApproveStore, approveStore } from "../../store";
import { FLOW_TYPE } from "../../types/enum";
import { history } from "../../router";

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

console.log(approveStore);

const columns = [
  {
    title: "日期",
    key: "date",
    dataIndex: "date",
    sorter: (a: ICheckInRecord, b: ICheckInRecord) => {
      return a.date > b.date ? 1 : -1;
    },
    render(date: string) {
      return <>{date}</>;
    }
  },
  {
    title: "星期",
    key: "week",
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
      return <>{weekToChinese(data.week)}</>;
    }
  },
  {
    title: "法定工作日",
    key: "isWorkDay",
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
      return <>{data.isWorkDay ? "是" : "-"}</>;
    }
  },
  {
    title: "签到",
    key: "signInAt",
    render(data: ICheckInRecord) {
      if (data.signInAt === 0) {
        return <>-</>;
      }
      return <>{moment(data.signInAt as number).format("hh:mm")}</>;
    }
  },
  {
    title: "签退",
    key: "signOutAt",
    render(data: ICheckInRecord) {
      if (data.signOutAt === 0) {
        return <>-</>;
      }
      return <>{moment(data.signOutAt as number).format("HH:mm")}</>;
    }
  },
  {
    title: "餐补",
    key: "hasFoodSubsidy",
    dataIndex: "hasFoodSubsidy",
    filters: [
      {
        text: "餐补",
        value: "true"
      }
    ],
    onFilter: (value: string, record: ICheckInRecord) => {
      if(!record.overtime) return false;
      if(record.isWorkDay){
        return String(record.overtime.hour >= 1) === value;
      }else{
        return String(record.overtime.hour >= 4) === value;
      }
    },
    render(hasFoodSubsidy: boolean) {
      return <>{hasFoodSubsidy ? "有" : "-"}</>;
    }
  },
  {
    title: "加班",
    key: "status",
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
      } else if (data.signInAt === 0) {
        return <>-</>;
      } else {
        return <>-</>;
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
        if(!data.overtime){
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

interface IMyCheckInState {
  data: ICheckInRecord[];
  loading: boolean;
  date: Moment;
}

export default class App extends React.Component<any, IMyCheckInState> {
  static path: string = "/my-check-in";

  state = {
    data: [],
    loading: false,
    date: moment().month(4)
  };

  componentDidMount() {
    this.initData();
  }

  initData() {
    this.setState({
      loading: true
    });
    services.getCheckIn(this.state.date.format("YYYYMM")).then(res => {
      this.setState({
        loading: false,
        data: convertData(res)
      });
    });
  }

  render() {
    return (
      <Row>
        <Col span={18} push={3}>
          <br />
          <h1>考勤记录</h1>
          <Form layout="inline">
            <FormItem label="考勤月份">
              <MonthPicker
                defaultValue={this.state.date}
                onChange={(date: Moment) => {
                  this.setState(
                    {
                      date
                    },
                    () => {
                      this.initData();
                    }
                  );
                }}
                format={"YYYYMM"}
              />
            </FormItem>
          </Form>
          <br />
          <Table
            loading={this.state.loading}
            columns={columns}
            dataSource={this.state.data}
            rowKey="date"
            pagination={false}
            scroll={{ y: 400 }}
            footer={(currentPageData: Object[]) => {
              let data: ICheckInRecord[] = currentPageData as ICheckInRecord[];
              let totalOvertime = 0;
              let overtimeDays = 0;
              let foodSubsidyDay = 0;

              data.forEach(e => {
                if(e.overtime !== null){
                  totalOvertime += e.overtime.hour;
                  overtimeDays++;
                }
                if(e.hasFoodSubsidy){
                  foodSubsidyDay++;
                }
              });

              return (
                <>
                  <>
                    加班共计 {totalOvertime} 小时;
                  </>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <>
                    餐补共计 {foodSubsidyDay*20} 元
                  </>
                </>
              )
            }}
          />
        </Col>
      </Row>
    );
  }
}

/**
 * 转换薪人薪事返回的签到数据
 * 注： 如果选当月，会过滤掉未来的数据
 * @param originData
 * @returns {ICheckInRecord[]}
 */
function convertData(originData: any): ICheckInRecord[] {
  if (!originData) return [];
  const list: ICheckInRecord[] = [];
  originData.data.records.forEach((e: any) => {
    if (!e.signTimeList) {
      return;
    }

    let data: ICheckInRecord = {
      date: (() => {
        let ym = originData.data.attendance_md.yearmo;
        ym = `${ym.substr(0, 4)}-${ym.substr(4, 2)}-${
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
      status: "",
      overtime: null
    };

    // 是未来直接跳过
    let isFuture: boolean =
      moment(`${data.date} 00:00:00`).valueOf() > Date.now();
    if (isFuture) {
      return;
    }

    if (data.signInAt && data.signOutAt) {
      data.overtime = calcOverTime({
        isWeekDay: data.isWorkDay,
        signInAt: moment(data.signInAt),
        signOutAt: moment(data.signOutAt)
      });
    }
    data.week = calcWeek(
      moment(data.date + " 00:00:00").format("YYYY/MM/DD")
    ) as IWeek;
    data.hasFoodSubsidy = calcHasFoodSubsidy({
      isWorkDay: data.isWorkDay,
      overTime: data.overtime
    });

    list.push(data);
  });

  return list.reverse();
}
