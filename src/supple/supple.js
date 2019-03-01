import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import CheckIn from './view/checkinView';
import FormSubmit from './view/form';
import './index.less';
import { checkOauthPermission } from '../util';

if (checkOauthPermission()) {
  ReactDom.render(
    <BrowserRouter>
      <Switch>
        <Route exact path='/supple/formdata/:userId' component={FormSubmit} />
        <Route exact path='/supple/' component={CheckIn} />
      </Switch>
    </BrowserRouter>
    , document.getElementById('root'));
}
