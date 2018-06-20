/// <reference path="../../types.ts" />

import * as React from "react";
import {
  Col,
  Divider,
  Table,
  DatePicker,
  Row,
  Form,
  Tag,
  Tooltip,
  Switch,
  Radio,
  Calendar, Badge
} from "antd";
import styles from "../../assets/scss/app.scss";
import {findIndex} from "lodash";
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
import { RadioChangeEvent } from "antd/es/radio";
import { CalendarMode } from "antd/es/calendar";

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
      if (data.signInAt && data.signInAt.valueOf() === 0) {
        return <>-</>;
      }
      return <>{data.signInAt && data.signInAt.format("hh:mm")}</>;
    }
  },
  {
    title: "签退",
    key: "signOutAt",
    render(data: ICheckInRecord) {
      if (data.signOutAt && data.signOutAt.valueOf() === 0) {
        return <>-</>;
      }
      return <>{data.signOutAt && data.signOutAt.format("HH:mm")}</>;
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
      if (!record.overtime) return false;
      if (record.isWorkDay) {
        return String(record.overtime.hour >= 1) === value;
      } else {
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
      } else if (data.signInAt && data.signInAt.valueOf() === 0) {
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

enum DISPLAY {
  CALC,
  TABLE
}

interface IMyCheckInState {
  data: ICheckInRecord[];
  loading: boolean;
  date: Moment;
  display: DISPLAY;
}

export default class App extends React.Component<any, IMyCheckInState> {
  static path: string = "/my-check-in";

  state = {
    data: [],
    loading: false,
    date: moment(),
    display: DISPLAY.CALC
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
      }, () => {
        console.log(this.state);
      });
    });
  }

  handleDisplayChange = (e: RadioChangeEvent) => {
    this.setState({
      display: e.target.value
    });
  };

  handlePanelChange = (
    date: moment.Moment | undefined,
    mode?: CalendarMode
  ) => {};

  handleRenderDate = (date: Moment) => {
    let index = findIndex(this.state.data, {
      date: date.format("YYYY-MM-DD")
    } as any);
    if(index !== -1){
      let data: ICheckInRecord = this.state.data[index];
      if (data.signInAt && data.signInAt.valueOf() === 0 && data.signOutAt && data.signOutAt.valueOf() === 0) {
        return null;
      }

      let overtimeApplyStatus = "待申请";
      if (data.overtime && approveStore.hasApprove(data.overtime.startTime)) {
        overtimeApplyStatus = "已申请";
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

      return <ul>
        <li>
          <Badge status="default" text={`${data.signInAt && data.signInAt.format("HH:mm")}-${data.signOutAt && data.signOutAt.format("HH:mm")}`} />
        </li>
        {
          data.overtime && (
            <>
              <li>
                <Badge status="default" text={`加班：${data.overtime.hour}小时`} />
              </li>
              <li>
                <Badge status={overtimeApplyStatus === "待申请" ? "processing" : "success"} text={`状态：${overtimeApplyStatus}`} />
              </li>
            </>
          )
        }
      </ul>
    }
    return null;
  };

  render() {

    const totalRow = (currentPageData: Object[]) => {
      let data: ICheckInRecord[] = currentPageData as ICheckInRecord[];
      let totalOvertime = 0;
      let overtimeDays = 0;
      let foodSubsidyDay = 0;

      data.forEach(e => {
        if (e.overtime !== null) {
          totalOvertime += e.overtime.hour;
          overtimeDays++;
        }
        if (e.hasFoodSubsidy) {
          foodSubsidyDay++;
        }
      });

      return (
        <>
          <>加班共计 {totalOvertime} 小时;</>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <>餐补共计 {foodSubsidyDay * 20} 元</>
        </>
      );
    };

    return (
      <Row>
        <Col span={24} push={0}>
          <br />
          <h1>考勤记录</h1>
          <Row>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <div className="pull-right">
                显示方式：{" "}
                <RadioGroup
                  onChange={this.handleDisplayChange}
                  defaultValue={DISPLAY.CALC}
                >
                  <RadioButton value={DISPLAY.TABLE}>表格</RadioButton>
                  <RadioButton value={DISPLAY.CALC}>日历</RadioButton>
                </RadioGroup>
              </div>
            </Col>
          </Row>

          <br />
          {this.state.display === DISPLAY.TABLE ? (
            <Table
              loading={this.state.loading}
              columns={columns}
              dataSource={this.state.data}
              rowKey="date"
              pagination={false}
              scroll={{ y: 400 }}
              footer={totalRow}
            />
          ) : (
            <>
              <Calendar onPanelChange={this.handlePanelChange} dateCellRender={this.handleRenderDate}/>
              {totalRow(this.state.data)}
            </>
            )}

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
        moment(e.signTimeList[0].clockTime * 1000),
      signOutAt:
        e.signTimeList &&
        e.signTimeList[1] &&
        moment(e.signTimeList[1].clockTime * 1000),
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
