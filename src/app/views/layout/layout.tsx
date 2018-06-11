import * as React from "react";
import GlobalHeader from "./global-header";
import { Redirect, Route, Switch } from "react-router";
import MyCheckIn from "../my-check-in";
import Login from "../user/login";
import Approve from "../approve";
import { Col, Row } from "antd";
import AddOvertime from "../approve/add-overtime";

/**
 * 通用的页面布局
 */
export default class Layout extends React.Component {
  public render() {
    return (
      <>
        <GlobalHeader />
        <Row>
          <Col span={18} push={3}>
            <Switch>
              <Route path={MyCheckIn.path} component={MyCheckIn} />
              <Route path={AddOvertime.path} component={AddOvertime} />
              <Route path={Approve.path} component={Approve} />
              <Redirect to={MyCheckIn.path} />
            </Switch>
          </Col>
        </Row>
      </>
    );
  }
}
