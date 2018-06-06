/// <reference path="../../types.ts" />

import * as React from "react";
import { Col, Divider, Table, DatePicker, Row, Form, Tag, Tooltip } from "antd";
import styles from "../../assets/scss/app.scss";
import moment from "moment";
import { Moment } from "moment";
import {
  calcHasFoodSubsidy,
  calcOverTime,
  calcWeek,
  weekToChinese
} from "../../utils";
import { IWeek } from "../../interface";
import * as services from "../../services";
import GlobalHeader from "../layout/global-header";

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

const columns = [
  {
    title: "日期",
    key: "date",
    dataIndex: "date",
    sorter: (a: ICheckRecord, b: ICheckRecord) => {
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
    onFilter: (value: string, record: ICheckRecord) => {
      return record.week === parseInt(value);
    },
    render(data: ICheckRecord) {
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
    onFilter: (value: string, record: ICheckRecord) => {
      return String(record.isWorkDay) === value;
    },
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
    onFilter: (value: string, record: ICheckRecord) => {
      return String(record.isOvertime) === value;
    },
    render(hasFoodSubsidy: boolean) {
      return <>{hasFoodSubsidy ? "有" : "-"}</>;
    }
  },
  {
    title: "状态",
    key: "status",
    filters: [
      {
        text: "加班",
        value: "true"
      }
    ],
    onFilter: (value: string, record: ICheckRecord) => {
      return String(record.isOvertime) === value;
    },
    render(data: ICheckRecord) {
      if (data.isOvertime) {
        return (
          <Tooltip placement="bottom" title={`${data.overtime}小时`}>
            <Tag color="green">加班</Tag>
          </Tooltip>
        );
      } else if (data.signInAt === 0) {
        return <>-</>;
      } else {
        return <>正常</>;
      }
    }
  },
  {
    title: "操作",
    key: "action",
    render: (data: ICheckRecord) => (
      <span>
        {data.isOvertime && <a href="javascript:void(0)">申请加班</a>}
        {/*<Divider type="vertical" />*/}
      </span>
    )
  }
];

interface IMyCheckInState {
  data: ICheckRecord[];
  loading: boolean;
  date: Moment;
}

export default class App extends React.Component<any, IMyCheckInState> {
  static path: string = "/my-check-in";

  state = {
    data: [],
    loading: false,
    date: moment()
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
        <GlobalHeader />

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
          />
        </Col>
      </Row>
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

/**
 * 转换薪人薪事返回的签到数据
 * 注： 如果选当月，会过滤掉未来的数据
 * @param originData
 * @returns {ICheckRecord[]}
 */
function convertData(originData: any): ICheckRecord[] {
  if (!originData) return [];
  const list: ICheckRecord[] = [];
  originData.data.records.forEach((e: any) => {
    if (!e.signTimeList) {
      return;
    }

    let data: ICheckRecord = {
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
      status: ""
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
      data.isOvertime = data.overtime !== -1;
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
