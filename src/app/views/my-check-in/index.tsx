/// <reference path="../../types.ts" />

import * as React from "react";
import {
  Col,
  Table,
  DatePicker,
  Row,
  Form,
  Radio,
  Calendar,
  Badge,
  message,
  Button
} from "antd";
import styles from "../../assets/scss/app.scss";
import findIndex from "lodash/findIndex";
import { default as moment, Moment } from "moment";
import { ICheckInRecord, IWeek } from "../../types/interface";
import * as services from "../../services";
import {
  AddApproveStore,
  addApproveStore,
  approveStore,
  checkInStore
} from "../../store";
import { EOA_APPLY_TYPE, FLOW_TYPE } from "../../types/enum";
import { history } from "../../router";
import { RadioChangeEvent } from "antd/es/radio";
import { CalendarMode } from "antd/es/calendar";
import convertData from "./convert-data";
import columns from "./columns";
import { inject, observer } from "mobx-react";
import { exportData, fanweiOA } from "../../utils";

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

enum DISPLAY {
  CALC,
  TABLE
}

interface IMyCheckInState {
  loading: boolean;
  date: Moment;
  display: DISPLAY;
  tableHeight: number;
}

@inject("checkInStore")
@observer
export default class App extends React.Component<any, IMyCheckInState> {
  static path: string = "/my-check-in";

  className: string =
    "table" +
    Math.random()
      .toString()
      .replace(/^0\./, "");

  state = {
    loading: false,
    date: moment(),
    display: DISPLAY.TABLE,
    tableHeight: 400
  };

  componentDidMount() {
    this.initData();

    this.handleTableHeightResponse();
    window.addEventListener("resize", this.handleTableHeightResponse);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleTableHeightResponse);
  }

  initData() {
    if (checkInStore.data.length === 0) {
      this.setState({
        loading: true
      });
    }
    services.getCheckIn(checkInStore.date.format("YYYYMM")).then(res => {
      checkInStore.setData(convertData(res));
      this.setState({
        loading: false
      });
      // message.success("数据更新成功", 1);
    });
  }

  handleDisplayChange = (e: RadioChangeEvent) => {
    this.setState({
      display: e.target.value
    });
  };

  handleDateSelectChange = (date: Moment) => {
    checkInStore.setDate(date);
    this.setState({
      loading: true
    });
    this.initData();
  };

  handlePanelChange = (
    date: moment.Moment | undefined,
    mode?: CalendarMode
  ) => {};

  handleRenderDate = (date: Moment) => {
    let index = findIndex(checkInStore.data, {
      date: date.format("YYYY-MM-DD")
    } as any);
    if (index !== -1) {
      let data: ICheckInRecord = checkInStore.data[index];
      if (
        data.signInAt &&
        data.signInAt.valueOf() === 0 &&
        data.signOutAt &&
        data.signOutAt.valueOf() === 0
      ) {
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

      return (
        <ul>
          <li>
            <Badge
              status="default"
              text={`${data.signInAt &&
                data.signInAt.format("HH:mm")}-${data.signOutAt &&
                data.signOutAt.format("HH:mm")}`}
            />
          </li>
          {data.overtime && (
            <>
              <li>
                <Badge
                  status="default"
                  text={`加班：${data.overtime.hour}小时`}
                />
              </li>
              <li>
                <Badge
                  status={
                    overtimeApplyStatus === "待申请" ? "processing" : "success"
                  }
                  text={`状态：${overtimeApplyStatus}`}
                />
              </li>
            </>
          )}
        </ul>
      );
    }
    return null;
  };

  /**
   * 动态响应表格高度
   */
  handleTableHeightResponse = () => {
    let el: HTMLElement = document.querySelector(
      "." + this.className
    ) as HTMLElement;
    let antTableBody: HTMLElement = el.querySelector(
      ".ant-table-body"
    ) as HTMLElement;
    let bound: ClientRect = el.getBoundingClientRect();
    this.setState(
      {
        tableHeight: window.innerHeight - bound.top - 60 - 100
      },
      // () => {
      //   // ant mobile的一个奇怪的bug按Table控件的scroll.y进行设置时会出现宽度错乱。
      //   antTableBody.style.overflow = "auto";
      //   antTableBody.style.maxHeight = `${this.state.tableHeight}px`;
      // }
    );
  };

  handleApplyOA = () => {
    let data = exportData(EOA_APPLY_TYPE.FOOD);

    if (1) {
      message.info("功能开发中，敬请期待");
      return;
    }

    fanweiOA
      .login("", "")
      .then(() => {
        fanweiOA.openOAFlowApply(EOA_APPLY_TYPE.FOOD);
      })
      .catch(e => {
        console.error(e);
      });
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
        <Row>
          <Col span={16}>
            <>加班共计 {totalOvertime.toFixed(1)} 小时;</>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <>餐补共计 {foodSubsidyDay * 20} 元</>
          </Col>
          <Col span={8} className="text-right">
            <Button onClick={this.handleApplyOA}>一键申请OA</Button>
          </Col>
        </Row>
      );
    };

    return (
      <Row>
        <Col span={24} push={0}>
          <br />
          <Row>
            <Col span={12}>
              <Form layout="inline">
                <FormItem label="考勤月份">
                  <MonthPicker
                    defaultValue={this.state.date}
                    onChange={this.handleDateSelectChange}
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
                  defaultValue={DISPLAY.TABLE}
                >
                  <RadioButton value={DISPLAY.TABLE}>表格</RadioButton>
                  <RadioButton value={DISPLAY.CALC}>日历</RadioButton>
                </RadioGroup>
              </div>
            </Col>
          </Row>

          <br />

          {/* 表格 */}
          {this.state.display === DISPLAY.TABLE ? (
            <Table
              className={this.className}
              loading={this.state.loading}
              columns={columns}
              dataSource={checkInStore.data.map(e => e)}
              rowKey="date"
              pagination={false}
              footer={totalRow}
              scroll={{y: this.state.tableHeight}}
            />
          ) : (
            <>
              <Calendar
                onPanelChange={this.handlePanelChange}
                dateCellRender={this.handleRenderDate}
              />
              {totalRow(checkInStore.data)}
            </>
          )}
        </Col>
      </Row>
    );
  }
}
