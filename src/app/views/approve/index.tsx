import * as React from "react";
import { Card, Col, List, Row, Tabs, Tag, Modal, Form } from "antd";
import styles from "./index.scss";
import * as services from "../../services";
import { inject, observer } from "mobx-react";
import { ApproveStore } from "../../store";
import { IApprove } from "../../types/interface";
import moment from "moment";
import { APPROVE_STATUS, FLOW_TYPE } from "../../types/enum";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

interface IApproveProp {
  approveStore: ApproveStore;
}

interface IApproveState {
  dialogVisible: boolean;
  detail: IApprove | undefined;
}

@inject("approveStore")
@observer
export default class Index extends React.Component<IApproveProp,
  IApproveState> {
  static path: string = "/approve";

  state = {
    dialogVisible: false,
    detail: undefined
  };

  public handleOk = () => {
    this.setState({
      dialogVisible: false
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 8, offset: 0 },
      wrapperCol: { span: 7, offset: 1 }
    };

    const renderItem = (item: IApprove) => {
      let title: React.ReactNode = "";
      switch (item.flowType) {
        case FLOW_TYPE.OVERTIME:
          title = <>加班{item.meta.overtime_hour}小时（加班）</>;
          break;
        default:
          title = item.meta.flow_type_desc;
      }

      return (
        <List.Item>
          <List.Item.Meta
            title={<a onClick={() => {
              this.setState({
                detail: item,
                dialogVisible: true
              });
            }} href="javascript:void(0)">{title}</a>}
            description={`申请时间：${moment(
              item.applicationTime * 1000
            ).format("YYYY-MM-DD HH:mm:ss")}`}
          />
          <div>
            <Tag
              color={item.status === APPROVE_STATUS.SUCCESS ? "green" : "gray"}
            >
              {item.statusDesc}
            </Tag>
          </div>
        </List.Item>
      );
    };

    const renderModalDetail = () => {
      let detail: IApprove = this.state.detail as any;
      if (detail) {
        switch (detail.flowType) {
          case FLOW_TYPE.OVERTIME:
            return (
              <Form>
                <FormItem label="申请类型" {...formItemLayout}>
                  {detail.flowTypeDesc}
                </FormItem>
                <FormItem label="开始时间" {...formItemLayout}>
                  {moment(parseInt(detail.meta.start_date + "000")).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </FormItem>
                <FormItem label="结束时间" {...formItemLayout}>
                  {moment(parseInt(detail.meta.end_date + "000")).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )}
                </FormItem>
                <FormItem label="加班时长" {...formItemLayout}>
                  {detail.meta.overtime_hour}
                </FormItem>
                <FormItem label="补偿方式" {...formItemLayout}>
                  {detail.meta.compensation_way === "1" ? "调休" : "未知"}
                </FormItem>
                <FormItem label="申请事由" {...formItemLayout}>
                  {detail.meta.reason}
                </FormItem>
                <FormItem label="审批状态" {...formItemLayout}>
                  {detail.statusDesc}
                </FormItem>
              </Form>
            );
          case FLOW_TYPE.NOT_WORK:
            return (
              <Form>
                <FormItem label="申请类型" {...formItemLayout}>
                  {detail.flowTypeDesc}
                </FormItem>
                <FormItem label="开始时间" {...formItemLayout}>
                  {moment(parseInt(detail.meta.start_date + "000")).format("YYYY-MM-DD HH:mm:ss")}
                </FormItem>
                <FormItem label="结束时间" {...formItemLayout}>
                  {moment(parseInt(detail.meta.end_date + "000")).format("YYYY-MM-DD HH:mm:ss")}
                </FormItem>
                <FormItem label="申请事由" {...formItemLayout}>
                  {detail.meta.reason}
                </FormItem>
                <FormItem label="审批状态" {...formItemLayout}>
                  {detail.statusDesc}
                </FormItem>
              </Form>
            );
          default:
            return (
              <Form>
                <FormItem label="申请类型" {...formItemLayout}>
                  {detail.flowTypeDesc}
                </FormItem>
                <FormItem label="申请事由" {...formItemLayout}>
                  {detail.meta.reason}
                </FormItem>
                <FormItem label="审批状态" {...formItemLayout}>
                  {detail.statusDesc}
                </FormItem>
              </Form>
            );
        }
      } else {
        return null;
      }
    };

    return (
      <Col className={styles.main} span={12} push={6}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={`全部 (${this.props.approveStore.data.length})`}
            key="1"
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.approveStore.data}
              renderItem={renderItem}
            />
          </TabPane>
          <TabPane
            tab={`审批通过 (${this.props.approveStore.done.length})`}
            key="2"
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.approveStore.done}
              renderItem={renderItem}
            />
          </TabPane>
          <TabPane
            tab={`审批中 (${this.props.approveStore.wait.length})`}
            key="3"
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.approveStore.wait}
              renderItem={renderItem}
            />
          </TabPane>
          <TabPane
            tab={`审批驳回 (${this.props.approveStore.reject.length})`}
            key="4"
          >
            <List
              itemLayout="horizontal"
              dataSource={this.props.approveStore.reject}
              renderItem={renderItem}
            />
          </TabPane>
        </Tabs>

        <Modal
          title="申请详情"
          visible={this.state.dialogVisible}
          onOk={this.handleOk}
          onCancel={this.handleOk}
        >
          {renderModalDetail()}
        </Modal>
      </Col>
    );
  }
}
