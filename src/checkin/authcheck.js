import React from 'react';
import {Route } from 'react-router-dom';
import axios from 'axios'

export default () =>{
  const openId = sessionStorage.getItem('check_openid');
  if(!openId){
    const url = encodeURIComponent('http://cs.xigemall.com/checkin/checkinview');
    const appId = 'wx136539e52b4980bf';
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    sessionStorage.setItem('check_openid','123');
  }
}

