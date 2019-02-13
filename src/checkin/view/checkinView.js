import React from 'react';
import axios from 'axios';

export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
   }
   componentWillMount(){
   }
   componentDidMount(){
    console.log(window.location.href); 
    const url = encodeURIComponent('http://cs.xigemall.com/checkin/checkin.html');
    const appId = 'wx136539e52b4980bf';
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
   }
   render(){
     return <div>
       签到页面分为服务费经过几个
     </div>
   }
}
  