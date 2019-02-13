import React from 'react';
import axios from 'axios';

export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
   }
   componentWillMount(){
   }
   componentDidMount(){
     const url = encodeURIComponent('http://192.168.1.95:8000/checkin/checkin.html');
     const appId = 'wx136539e52b4980bf';
     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=SCOPE&state=STATE#wechat_redirect`
   }
   render(){
     return <div>
       签到页面
     </div>
   }
}
  