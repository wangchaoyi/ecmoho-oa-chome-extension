import * as React from "react";
import styles from "./login.scss";
import { observable } from "mobx";
import { FormComponentProps } from "antd/lib/form";
import { Alert, Button, Col, Form, Icon, Input, Row, message } from "antd";
import { Link } from "react-router-dom";
import * as services from "../../../services";
import { history, redirectToOrigin } from "../../../router";
import { valiators } from "../../../utils";
import { approveStore } from "../../../store";

const FormItem = Form.Item;

export default class Login extends React.Component {
  static path: string = "/login";

  public render() {
    const WrappedNormalLoginForm: any = Form.create()(LoginForm);

    return (
      <div className={styles.main}>
        <Row>
          <Col span={6} push={9}>
            {/*<h1 className={"text-center"}>薪人薪事</h1>*/}

            <br />

            <WrappedNormalLoginForm />
          </Col>
        </Row>
      </div>
    );
  }
}

export class LoginForm extends React.Component<FormComponentProps, any> {
  public state = {
    notice: "",
    submitting: false,

    verifyId: 0, // 验证码id，从服务器获取
    waiting: false,
    waitTime: 60,
    waitLoading: false
  };

  constructor(prop: any) {
    super(prop);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
  }

  public componentDidMount() {
    const { setFieldsValue } = this.props.form;
    if (location.hostname === "localhost") {
      setFieldsValue({
        account: "test1@business.com",
        password: "111111"
      });
    }
  }

  /**
   * 提交登录
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  public handleSubmit(event: React.FormEvent<HTMLInputElement>) {
    console.log("submit");
    event.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);

        this.setState({
          submitting: true
        });
        services
          .login({
            mobile: values.account,
            verify_code: values.verify,
            verify_code_id: this.state.verifyId,
            type: 1
          })
          .then(res => {
            message.success(res.message);
            approveStore.refresh();
            redirectToOrigin();
          })
          .catch(e => {
            this.setState({
              notice: e.message || "登录失败，帐号或者密码错误",
              submitting: false
            });
          });
      }
    });
  }

  /**
   * 发送验证码
   */
  public handleSendVerify = () => {
    // let account = this.props.form.getFieldValue("account");
    this.setState({
      notice: ""
    });
    this.props.form.validateFields(["account"], (err, values) => {
      if (err) {
        this.setState({
          notice: err.account.errors[0].message
        });
        return;
      }
      this.setState({
        waitLoading: true
      });

      services
        .getVerify({ mobile: values.account })
        .then(res => {
          if (res.status) {
            message.success(res.message);
            this.setState({
              waitLoading: false,
              waiting: true,
              waitTime: 60,
              verifyId: res.data.code_id
            });

            let timer = setInterval(() => {
              this.setState(
                {
                  waitTime: this.state.waitTime - 1
                },
                () => {
                  if (this.state.waitTime <= 0) {
                    this.setState({
                      waiting: false,
                      waitTime: 60
                    });
                  }
                  clearInterval(timer);
                }
              );
            }, 1000);
          } else {
            message.error(res.message);
            this.setState({
              waitLoading: false
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    });
  };

  /**
   * 渲染错误消息
   * @returns {any}
   */
  public renderMessage() {
    if (!this.state.notice) {
      return;
    }
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={this.state.notice}
        type="error"
        showIcon={true}
      />
    );
  }

  public render() {
    /* form对象是因为外部调用的时候注入了， 所以在这个组件看不到任何声明 */
    const { getFieldDecorator } = this.props.form;
    const { renderMessage } = this;

    return (
      <Form onSubmit={this.handleSubmit} className={styles["login-page"]}>
        {renderMessage()}
        <FormItem>
          {getFieldDecorator("account", {
            rules: [
              { required: true, message: "手机号码不能为空" },
              { validator: valiators.isMobile(), message: "手机号码格式不正确" }
            ],
            validateTrigger: "onBlur"
          })(
            <Input
              prefix={
                <Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              maxLength={11}
              placeholder="请输入手机号码"
              size="large"
            />
          )}
        </FormItem>
        <FormItem>
          <Row gutter={20}>
            <Col span={16}>
              {getFieldDecorator("verify", {
                rules: [{ required: true, message: "验证码不能为空" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  maxLength={6}
                  type="tel"
                  placeholder="请输入6位验证码"
                  size="large"
                />
              )}
            </Col>
            <Col span={8}>
              <Button
                className="pull-right"
                size="large"
                onClick={this.handleSendVerify}
                disabled={this.state.waiting}
                loading={this.state.waitLoading}
              >
                {this.state.waiting
                  ? `等待${this.state.waitTime}s...`
                  : "获取验证码"}
              </Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.btnLogin}
            loading={this.state.submitting}
            size="large"
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
