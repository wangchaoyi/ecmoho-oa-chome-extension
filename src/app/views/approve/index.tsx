import * as React from "react";
import { Card, Col, List, Row, Tabs, Tag, Modal, Form } from "antd";
import styles from "./index.scss";
import * as services from "../../services";
import { inject, observer } from "mobx-react";
import { ApproveStore } from "../../store";
import { IApprove } from "../../types/interface";
import moment from "moment";
import { APPROVE_STATUS } from "../../types/enum";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

interface IApproveProp {
  approveStore: ApproveStore;
}

@inject("approveStore")
@observer
export default class Index extends React.Component<IApproveProp, {}> {
  static path: string = "/approve";

  state = {
    dialogVisible: false
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

    const renderItem = (item: IApprove) => (
      <List.Item>
        <List.Item.Meta
          title={
            <a href="https://ant.design">
              加班{item.meta.overtime_hour}小时（加班）
            </a>
          }
          description={`申请时间：${moment(item.applicationTime * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          )}`}
        />
        <div>
          <Tag color={item.status === APPROVE_STATUS.SUCCESS ? "green" : "gray"}>{item.statusDesc}</Tag>
        </div>
      </List.Item>
    );

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
        </Tabs>

        <Modal
          title="申请详情"
          visible={this.state.dialogVisible}
          onOk={this.handleOk}
        >
          <Form>
            <FormItem label="申请类型" {...formItemLayout}>
              1
            </FormItem>
            <FormItem label="开始时间" {...formItemLayout}>
              1
            </FormItem>
            <FormItem label="结束时间" {...formItemLayout}>
              1
            </FormItem>
            <FormItem label="加班时长" {...formItemLayout}>
              1
            </FormItem>
            <FormItem label="补偿方式" {...formItemLayout}>
              1
            </FormItem>
            <FormItem label="申请事由" {...formItemLayout}>
              1
            </FormItem>
          </Form>
        </Modal>
      </Col>
    );
  }
}
