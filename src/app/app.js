import React from 'react';
import ReactDom from 'react-dom';
import Choice from './houtai/choice';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { checkOauthPermission } from '../util';

if (checkOauthPermission()) {
  ReactDom.render(
    <LocaleProvider locale={zhCN}>
      <Choice />
    </LocaleProvider>, document.getElementById('root'));
}

