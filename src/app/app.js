import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import env from '../.env.json';
import WelcomePage from './app/welcome';
import SelectorPage from './app/selector';
import CheckIn from './app/checkin/checkin';
import './app.less';

dd.ui.webViewBounce.disable();

ReactDom.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/selector" component={SelectorPage} />
      <Route exact path="/checkin" component={CheckIn} />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));

window.DINGTALK_CORP_ID = env.dingtalk.corp_id;
