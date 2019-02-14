import React from 'react';
import CheckSub from './checksub';
import './checkform.less';
import logo from 'public/checkin/logo.png';
import xjimg from 'public/checkin/xj.png';
import checkin from 'public/checkin/checkin.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class CheckForm extends React.Component {
  state = {
    pageTranslate:null,
  }

  handleClick = (e)=>{
    e.preventDefault();
    this.setState({
      pageTranslate:'-100%'
    })
  }
  render() {
    const {pageTranslate} = this.state;
    return (
      <React.Fragment>
      <div className='checkinPage' style={{transition:'transform 1s ease',transform:`translateY(${pageTranslate})`}}>
        <div style={{height:'7.407%'}}></div>
        <div className='logo'>
          <img src={logo}/>
        </div>
        <div style={{height:'17.241%'}}></div>
        <div className='xj'>
          <img src={xjimg}></img>
        </div>
        <div style={{height:'7.39%'}}></div>
        <div className='triangle'>
          <img src={triangle}></img>
        </div>
        <div style={{height:'9.23%'}}></div>
        <div className='checkin'>
          <img className='checkinbtn' src={checkin} onClick={this.handleClick}></img>
          <div className='smline'>
            <img  src={smline} ></img>
          </div>
        </div>
        <div style={{height:'1.2%'}}></div>
        <div className='gxline'>
          <img src={gxline}></img>
        </div>
      </div>
      <div style={{height:'100%',transition:'transform 1s ease',transform:`translateY(${pageTranslate})`}}><CheckSub/></div>
      </React.Fragment>
    );
  }
}
  