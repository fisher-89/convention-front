import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Choice from './app/houtai/choice';

ReactDom.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Choice} />
    </Switch>
  </BrowserRouter>
), document.getElementById('root'));