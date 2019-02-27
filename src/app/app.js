import React from 'react';
import ReactDom from 'react-dom';
import Choice from './houtai/choice';
import { checkOauthPermission } from '../util';

if (checkOauthPermission()) {
  ReactDom.render(<Choice />, document.getElementById('root'));
}

