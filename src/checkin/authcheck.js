import React from 'react';
import {Route } from 'react-router-dom';

export default () =>{
  console.log("dsgdsgs");
  const url = encodeURIComponent('http://cs.xigemall.com/checkin/checkin.html');
  const appId = 'wx136539e52b4980bf';
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  // return <Route></Route>
}

