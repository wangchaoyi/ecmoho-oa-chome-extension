import * as React from "react";
import { Col, Row, Form, Input, DatePicker, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import styles from "./add-overtime.scss";
import { valiators } from "../../utils";
import moment = require("moment");
import * as services from "../../services";
import { Moment } from "moment";
import { FLOW_TYPE } from "../../types/enum";
import { history } from "../../router";
import { approveStore, AddApproveStore, ApproveStore } from "../../store";
import { observer, inject } from "mobx-react";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

/**
 * 加班申请
 */
export default class AddOvertime extends React.Component {
  static path: string = "/approve/add/overtime";

  public render() {
    const WrappedNormalRegisterForm: any = Form.create()(AddApproveForm);

    return <WrappedNormalRegisterForm />;
  }
}

interface IForm extends FormComponentProps {
  addApproveStore: AddApproveStore;
  approveStore: ApproveStore;
}

@inject("approveStore")
@inject("addApproveStore")
@observer
class AddApproveForm extends React.Component<IForm, {}> {
  state = {
    fetchOperatorLoading: true,
    operatorName: "" // 审批者姓名，从服务器中拉取
  };

  private handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (err) {
        return message.warning("表单字段验证未通过");
      }

      let dateTime: [Moment, Moment] = values.dateTime;

      services
        .addApproval({
          start_date: dateTime[0].format("YYYY-MM-DD HH:mm"),
          end_date: dateTime[1].format("YYYY-MM-DD HH:mm"),
          flow_type: FLOW_TYPE.OVERTIME,
          overtime_compensation_rule: 1,
          custom_field: "[]",
          ...values
        })
        .then(res => {
          if (res.status) {
            message.success(res.message);
            approveStore.refresh();
            history.push("/my-check-in");
          } else {
            message.error(res.message);
          }
        })
        .catch(e => {
          if (e.message) {
            message.error(e.message);
          } else {
            message.error("未知错误");
            console.error(e);
          }
        });
    });
  };

  private fetchOpearator() {
    services
      .getFirstApprover(FLOW_TYPE.OVERTIME, {
        start_date: "2018-01-01 00:00",
        end_date: "2018-01-01 00:00",
        overtime_hour: 1,
        overtime_compensation_rule: 1,
        reason: "",
        custom_field: "[]",
        flow_type: FLOW_TYPE.OVERTIME
      })
      .then(res => {
        if (res.status) {
          this.setState({
            fetchOperatorLoading: false,
            operatorName: res.data[0]
          });
        } else {
          this.setState({
            fetchOperatorLoading: false,
            operatorName: "获取失败"
          });
        }
      });
  }

  componentDidMount() {
    this.fetchOpearator();

    const data = this.props.addApproveStore.data;

    this.props.form.setFieldsValue({
      dateTime: [
        moment(data.start_date || Date.now()),
        moment(data.end_date || Date.now())
      ],
      overtime_hour: data.overtime_hour,
      reason: data.reason
    });
  }

  componentWillUnmount() {
    this.props.addApproveStore.reset();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8, offset: 0 },
      wrapperCol: { span: 7, offset: 1 }
    };

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label={"申请类型"} {...formItemLayout}>
            <p>加班</p>
          </FormItem>

          <FormItem label={"起止时间"} {...formItemLayout}>
            {getFieldDecorator("dateTime", {
              rules: [{ required: true, message: "请选择加班时间范围" }],
              validateTrigger: "onChange"
            })(
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder={["Start Time", "End Time"]}
                size="large"
              />
            )}
          </FormItem>

          <FormItem label={"申请类型"} {...formItemLayout}>
            <p>调休假</p>
          </FormItem>

          <FormItem label={"加班时长"} {...formItemLayout}>
            {getFieldDecorator("overtime_hour", {
              rules: [
                { required: true, message: "请填写加班时间范围" },
                { validator: valiators.rangeFloat(0, 24) }
              ],
              validateTrigger: "onChange"
            })(<Input placeholder={"0~24"} size="large" addonAfter="小时" />)}
          </FormItem>

          <FormItem label={"申请事由"} {...formItemLayout}>
            {getFieldDecorator("reason", {})(
              <TextArea maxLength={300} placeholder={"0-300字"} rows={3} />
            )}
          </FormItem>

          <FormItem label={"审批人"} {...formItemLayout}>
            <p>
              {this.state.fetchOperatorLoading
                ? "loading..."
                : this.state.operatorName}
            </p>
          </FormItem>

          <FormItem wrapperCol={{ span: 7, offset: 9 }}>
            <Button
              className={styles.btnSubmit}
              type="primary"
              size="large"
              htmlType="submit"
            >
              提交
            </Button>
            <Button type="default" size="large">
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
