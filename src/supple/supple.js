import React from 'react';
import ReactDom from 'react-dom';
import { history } from './history';
import { Router, Switch, Route } from 'react-router-dom'
import CheckIn from './view/checkinView';
import FormSubmit from './view/form';
import './index.less';
import { checkOauthPermission } from '../util';

if (checkOauthPermission()) {
  ReactDom.render(
    <Router history={history}>
      <Switch>
        <Route exact path='/' component={CheckIn} />
        <Route exact path='/formdata/:userId' component={FormSubmit} />
      </Switch>
    </Router>
    , document.getElementById('root'));
}
