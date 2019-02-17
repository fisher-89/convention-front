import React,{Suspense } from 'react';
import Loading from './loading';
import CheckForm from './checkform';
import CheckSub from './checksub';
import LookOver from './lookover';
import axios from 'axios';

export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
      this.state = {
        code:null,
        // openId:localStorage.getItem('check_openId'),
      }
   }
   componentWillMount(){
     this.GetCode();
   }
   componentDidMount(){
      const {code } = this.state;
      const openId = localStorage.getItem('check_openId');
      if(!code && !openId){
        const url = encodeURIComponent('http://cs.xigemall.com/checkin/index.html');//
        const appId = 'wx136539e52b4980bf';
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      }else if(code && !openId){
        const data = {'code':code}
        axios.post('/api/openid',
          data).then(res => {
            if(res.status == '201'){
               localStorage.setItem('check_openId',res.data['openid']);
            }
          }).catch(error=>{
            console.log(error);
          })
      }
   }

  GetCode() {   
    const url = location.search; 
    let code = null;
    if (url.indexOf("?") != -1) {   
       const str = url.substr(1);   
       const strs = str.split("&");
       code = strs[0].split('=')[1]

    }
    this.state.code = code;
  }   
   render(){
    const {code} = this.state;
    const openId = localStorage.getItem('check_openId');
    // if(!code && !openId){
    //   return <Loading/>
    // }
    return openId?(<React.Fragment>
          <Suspense fallback={<Loading/>}>
            <LookOver/>
          </Suspense>
        </React.Fragment>):(<React.Fragment>
                          <Suspense fallback={<Loading/>}>
                            <CheckForm/>
                          </Suspense>
                        </React.Fragment>)
   }
}
  