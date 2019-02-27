import React from 'react';
import ReactDom from 'react-dom';
import {history } from './history';
import {Router,Switch,Route} from 'react-router-dom'
import CheckIn from './view/checkinView';
import FormSubmit from './view/form';
import './index.less';


ReactDom.render(
<Router history={history}>
  <Switch>
    <Route exact path='/' component={CheckIn}/>
    <Route  path='/formdata' component={FormSubmit}/>
</Switch> 
</Router>
, document.getElementById('root'));
