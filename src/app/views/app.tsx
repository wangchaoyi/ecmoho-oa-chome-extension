import * as React from "react";
import { Provider } from "mobx-react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { history } from "../router";
import * as stores from "../store";

import MyCheckIn from "./my-check-in";
import Login from "./user/login";

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Provider {...stores}>
          <div className="main-wrapper">
            <Switch>
              <Route path={MyCheckIn.path} component={MyCheckIn} />
              <Route path={Login.path} component={Login} />
              <Redirect to={MyCheckIn.path} />
            </Switch>
          </div>
        </Provider>
      </Router>
    );
  }
}
