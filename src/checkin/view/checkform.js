import React from 'react';
import CheckSub from './checksub';
import './checkform.less';
import logo from 'public/checkin/logo.png';
import xj from 'public/checkin/xj.png';
import checkin from 'public/checkin/checkin.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class CheckForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pageTranslate:null,
      wordAnimate:null,
      originalHeight:null,
      clientEle:null,
    }  
  }
  // componentDidMount(){}
  handleClick = (e)=>{
    e.preventDefault();
    const originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
    // console.log(this.state.clientEle,444);
    // const {x,y,width,height}= document.getElementsByClassName('imgCLient')[0];
    // const clientEle = document.getE
    // console.log("x,y",x,y,height,width);
    this.setState({
      pageTranslate:'-100%',
      wordAnimate:true,
      originalHeight:originalHeight,
      // clientEle:width,
    })
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
  getchildRef = (instance)=>{
    // const clientEle = instance.getBoundClientRect();
    // const {width,height} = instance;
    // this.state.clientEle = clientEle;

    console.log("ce",instance);
    // this.setState({

    // })
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
          <img src={xj}></img>
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
      <div style={{height:'100%',overflowY:'auto',transition:'transform 1s ease',transform:`translateY(${pageTranslate})`}}><CheckSub {...this.state} getchildRef={this.getchildRef}/></div>
      </React.Fragment>
    );
  }
}
  