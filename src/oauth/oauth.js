import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import GetAccessToken from './GetAccessToken';

ReactDom.render(
  <BrowserRouter>
    <Switch>
      <Route path="/passport/get_access_token" component={GetAccessToken} />
    </Switch>
  </BrowserRouter>, document.getElementById('root'));

