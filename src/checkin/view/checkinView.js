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
        openId:localStorage.getItem('check_openId'),
      }
   }
   componentWillMount(){
     this.GetCode();
   }
   componentDidMount(){
      const {code,openId } = this.state;
      if(!code && !openId){
        const url = encodeURIComponent('http://cs.xigemall.com/checkin/index.html');//
        const appId = 'wx136539e52b4980bf';
        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      }else{
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

  //表单提交之后，页面切换
  handleChangepage = ()=>{
    this.setState({

    })
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
    const {code, openId} = this.state;
    console.log(openId,"openId",localStorage.getItem('check_openId'));
    // if(!code){
    //   return <Loading/>
    // }
    return openId?(<React.Fragment>
          <Suspense fallback={<Loading/>}>
            <CheckForm/>
          </Suspense>
        </React.Fragment>):(<React.Fragment>
                          <Suspense fallback={<Loading/>}>
                            <CheckForm/>
                          </Suspense>
                        </React.Fragment>)
   }
}
  