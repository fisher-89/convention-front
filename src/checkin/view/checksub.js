import React from 'react';
import {Toast} from 'antd-mobile';
import axios from 'axios';
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


export default class CheckSub extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      acountname: null,
      password: null,
      originalHeight:null,
    }
  }
  componentDidMount(){
    document.addEventListener('keypress',this.handelEnter);
    const originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
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
  handleResize = (originalHeight) =>{
    const resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
    if(resizeHeight-0<originalHeight-0){
      this.setState({
        originalHeight:originalHeight
      })
    }else{
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
    const {openid } = this.props;
    if(!(acountname && password)){
      Toast.fail('所填内容不能为空',1);
      return;
    }
    // if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(password))){
    //   Toast.fail('手机号格式不正确',1);
    //   return;
    // }
    const data  = {
      'openid':sessionStorage.getItem('checkin_openId'),
      'name':acountname,
      'mobile':password
    }
    axios.post('/api/sign',data).then(res=>{
      
    }).catch(err=>{
      console.log(err,'ddss')
    })
  }
  render() {
    const {wordAnimate } = this.props;
    const {originalHeight} = this.state;
    // const animate = wordAnimate?{animation:'firstword 1s ease',animationDelay:'1s'}:null;
    const firstanimate = wordAnimate?{width:'100%',transition: 'width 1s ease',transitionDelay:'1s'}:null;
    const secondanimate = wordAnimate?{width:'100%',transition: 'width 1s ease',transitionDelay:'1.6s'}:null;
    const threeanimate = wordAnimate?{width:'100%',transition: 'width .5s ease',transitionDelay:'2.4s'}:null;
    const original = originalHeight?{height:`${originalHeight}px`}:null;
    return (
      <div className='checkinPage' style={{...original,backgroundPosition:'0 -60px'}}>
        <div style={{height:'14.77%'}}></div>
        <div className='lookback'>
           <div className='first' style={firstanimate}>
              <img src={firstword}/>
           </div>
           <div className='second' style={secondanimate}>
            <img src={secondword}></img>
           </div>
           <div className='three' style={threeanimate}>
            <img src={threeword}></img>
           </div>
        </div>
        <div style={{height:'7.38%'}}></div>
        <div className='form'>
          <h3>请填写您的个人信息</h3>
          <div className='formname'>
            <label>*您的姓名</label>
            <div className='forminput'>
              <input type='text' onChange={this.handlegetName}/>
            </div>
          </div>
          <div className='formphone'>
            <label>*您的电话</label>
            <div className='forminput'>
              <input type='text' onChange={this.handlePassword}/>
            </div>
          </div>
        </div>
        <div style={{height:'13.54%'}}></div>
        <div className='submit'>
          <img className='submitbtn' src={submit} onClick={this.handleSubmit}></img>
        </div>
        <div style={{height:'1.2%'}}></div>
        <div className='gxline'>
          <img src={gxline}></img>
        </div>
      </div>
    );
  }
}
  