import React from 'react';
import axios from 'axios';
import {Toast} from 'antd-mobile';
import './checkform.less';
import './checksub.less';
import logo from 'public/checkin/logo.png';
import xjimg from 'public/checkin/xj.png';
import submit from 'public/checkin/submit.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';
import firstword from 'public/checkin/firstword.png';
import secondword from 'public/checkin/secondword.png';
import threeword from 'public/checkin/threeword.png';
import formimg from 'public/checkin/form.png';

export default class CheckSub extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      acountname: null,
      password: null,
      originalHeight:null,
      formW:null,
      fontSize:null,
    }
  }
  componentDidMount(){
    document.addEventListener('keypress',this.handelEnter);
    //动态获取高度
    const originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
    const formWidth = originalHeight * 0.2463 * 1.5;
    const fontSize = originalHeight * 0.2463 * 0.05;
    this.setState({
      formW:formWidth,
      fontSize:fontSize,
    })
    const that = this;
    window.onresize = function(e){
      // alert(that);
      that.handleResize(originalHeight);};
  }
  componentWillUnmount(){
    document.removeEventListener('keypress',this.handelEnter);
    window.onresize = null;
  }
  handlegetName = (e) => {
     e.preventDefault();
     this.state.acountname = e.target.value;
  }

  handlePassword = (e) => {
    e.preventDefault();
    this.state.password = e.target.value;
  }
  handleMove = (e) => {
    e.preventDefault();
    return;
  }

  handleResize = (originalHeight) =>{
    const resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
    if(resizeHeight-0<originalHeight-0){
      // document.removeEventListener('touchmove',this.props.Move)
      this.setState({
        originalHeight:originalHeight
      })
    }else{
      // document.addEventListener("touchmove",this.props.Move);
      this.setState({
        originalHeight:null
      })
    }
  }
  handelEnter = (e)=>{
    if (e.keyCode == 13) { //如果按的是enter键 13是enter 
      e.preventDefault(); //禁止默认事件（默认是换行）
      this.handleSubmit(e); 
    }
    return;
  }
  handleSubmit = (e)=>{
    e.preventDefault();
    const {acountname, password} = this.state;
    console.log(acountname,password,11)
    if(!(acountname && password)){
      Toast.fail('所填内容不能为空',1);
      return;
    }
    // if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(password))){
    //   Toast.fail('手机号格式不正确',1);
    //   return;
    // }
    const data  = {
      'name':acountname,
      'mobile':password
    }
    axios.post('/api/sign',data).then(res=>{
      if(res.status == '201'){
        // localStorage.setItem('check_openId',res.data['openid']);
        localStorage.setItem('check_name',res.data['name']);
        localStorage.setItem('check_avatar',res.data['avatar']);
        Toast.success('表单提交成功',1);
        //提交成功跳转至，节目单页面
      }
    }).catch(err=>{
      //错误返回码
      const {response } = err;
      console.log(response);
      if(response.status == '422'){
          Toast.fail(response.data.errors['mobile']['0'],1);
      }
      if(response.status == '500'){
        Toast.fail('请在公众号中打开',1);
    }
      if(response.status =='400'){
        const message = JSON.parse(response.data.message);
        localStorage.setItem('check_name',message['name']);
        localStorage.setItem('check_avatar',message['avatar']);
        Toast.fail('用户已签到', 1);
      }

    })
  }
  render() {
    const {wordAnimate ,clientEle} = this.props;
    const {originalHeight, formW, fontSize} = this.state;
    // const animate = wordAnimate?{animation:'firstword 1s ease',animationDelay:'1s'}:null;
    const firstanimate = wordAnimate?{width:'100%',transition: 'width 1s linear',transitionDelay:'1s'}:null;
    const secondanimate = wordAnimate?{width:'100%',transition: 'width 1s linear',transitionDelay:'1.7s'}:null;
    const threeanimate = wordAnimate?{width:'100%',transition: 'width 1s linear',transitionDelay:'2.7s'}:null;
    const original = originalHeight?{height:`${originalHeight}px`}:null;
    // alert(original);
    console.log(clientEle,333);
    return (
      <div className='checkinPage' style={{...original}}>
        <div style={{height:'14.77%'}}></div>
        <div className='lookback' style={{width:formW}}>
           <div className='first' style={firstanimate}>
              <img  src={firstword}/> 
           </div>
           <div className='second' style={secondanimate}>
            <img src={secondword}></img>
           </div>
           <div className='three' style={threeanimate}>
            <img src={threeword}></img>
           </div>
        </div>
        <div style={{height:'7.38%'}}></div>
        <div className='form'  style={{width:formW,fontSize:fontSize}}>
            <div className='formcontainer'>
              <img className='imgCLient' src={formimg}></img>
              <input style={{fontSize:fontSize}} className='formname' type='text'  onChange={this.handlegetName}/>
              <input style={{fontSize:fontSize}} className='formphone' type='text' onChange={this.handlePassword}/>
            </div>
        </div>
        <div style={{height:'13.54%'}}></div>
        <div className='submit'>
          <img className='submitbtn' src={submit} onTouchStart={this.handleSubmit}></img>
          <div className='smline'>
            <img  src={smline} ></img>
          </div>
        </div>
        <div style={{height:'1.2%'}}></div>
        <div className='gxline'>
          <img src={gxline}></img>
        </div>
      </div>
    );
  }
}
  