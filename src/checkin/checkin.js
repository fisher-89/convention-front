import React from 'react';
import ReactDom from 'react-dom';
import CheckIn from './view/checkinView';
import AuthCheck from './authcheck';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDom.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/checkin" component={AuthCheck} />
      {/* <Route exact path="/checkin/checkin.html" component={CheckIn} /> */}
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));
