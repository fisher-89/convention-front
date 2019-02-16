import React from 'react';
import './checkform.less';
import './lookover.less';
import logo from 'public/checkin/logo.png';
import xjimg from 'public/checkin/xjimg.png';
import viewjm from 'public/checkin/viewjm.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class LookOver extends React.Component {
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     imageSrc:null,
  //   }
  // }
  render() {
    const imageSrc= localStorage.getItem('check_avatar');
    const checkName = localStorage.getItem('check_name');
    return (
      <div className='checkinPage'>
        <div style={{height:'7.407%'}}></div>
        <div className='logo'>
          <img src={logo}/>
        </div>
        <div style={{height:'7.407%'}}></div>
        <div className='xjimg'>
          <img src={xjimg}></img>
        </div>
        <div style={{height:'7.39%'}}></div>
        <div className='showavatar'>
           <img src={imageSrc}/>
        </div>
        <div style={{height:'2.46%'}}></div>
        <div className='showname'>
          {checkName}
        </div>
        <div style={{height:'14.71%'}}></div>
        <div className='viewjm'>
          <img className='viewjmbtn' src={viewjm}></img>
        </div>
        <div style={{height:'1.2%'}}></div>
        <div className='gxline'>
          <img src={gxline}></img>
        </div>
      </div>
    );
  }
}
  