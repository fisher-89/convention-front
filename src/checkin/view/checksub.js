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


export default class CheckSub extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      acountname: null,
      password: null
    }
  }
  
  handlegetName = (e) => {
     e.preventDefault();
     this.state.acountname = e.target.value;
  }
  handlePassword = (e) => {
    e.preventDefault();
    this.state.password = e.target.value;
  }
  handleSubmit = (e)=>{
    e.preventDefault();
    const {acountname, password} = this.state;
    const {openid } = this.props;
    if(!(acountname || password)){
      Toast.fail('所填内容不能为空',1);
      return;
    }
    if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(password))){
      Toast.fail('手机号格式不正确',1);
      return;
    }
    const data  = {
      'openid':'openid',
      'name':acountname,
      'mobile':password
    }
    axios.post('api/sign',data).then(res=>{
      console.log(res,'提交表单');
    }).catch(err=>{
      console.log(err,'ddss')
    })
  }
  render() {
    return (
      <div className='checkinPage'>
        <div style={{height:'14.77%'}}></div>
        <div className='lookback'>
           <p className='first'>回首2018，我们收获成绩和成长</p>
           <p className='second'>起航2019，携手共创辉煌，争做行业领头人</p>
           <p className='three'>2019,一路势不可挡</p>
        </div>
        <div style={{height:'7.39%'}}></div>
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
        <div style={{height:'9.23%'}}></div>
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
  