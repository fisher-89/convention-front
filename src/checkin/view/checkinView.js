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
      }
   }
   componentWillMount(){
     this.GetCode();
   }
   componentDidMount(){
      console.log(window.location.href); 
      const {code } = this.state;
      // const openId = sessionStorage.getItem('check_openid');
      console.log(code,333)
      if(!code){
        const url = encodeURIComponent('http://cs.xigemall.com/checkin/checkin.html');//
        const appId = 'wx136539e52b4980bf';
        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
        // sessionStorage.setItem('check_openid','123');//
      }else{
        const data = {'code':code}
        axios.post('/api/openid',
          data).then(res => {
            console.log(res,333)
          }).catch(error=>{
            console.log(error);
          })
      }
   }

  GetCode() {   
    const url = location.search; //获取url中"?"符后的字串   
    let code = null;
    if (url.indexOf("?") != -1) {   
       const str = url.substr(1);   
       const strs = str.split("&");
       code = strs[0].split('=')[1]

    }
    this.state.code = code;
  }   
   render(){
    const {code } = this.state;
    // if(!code){
    //   return <Loading/>
    // }
     return(<React.Fragment>
        <Suspense fallback={<Loading/>}>
          <CheckForm/>
        </Suspense>
     </React.Fragment>)
   }
}
  