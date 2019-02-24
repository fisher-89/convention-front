import React from 'react';
import CheckSub from './checksub';
import './checkform.less';
import logo from 'public/checkin/logo.png';
import xj from 'public/checkin/xj.png';
import checkin from 'public/checkin/checkin.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class CheckForm extends React.PureComponent {
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
    this.setState({
      pageTranslate:true,
      wordAnimate:true,
      originalHeight:originalHeight,
    })
  }
  // componentDidMount(){
  //   const originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
  //   this.setState({
  //     originalHeight:originalHeight,
  //   })
  // }
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
  //transform:`translateY(${pageTranslate})`,height:`${originalHeight}px`
  render() {
    const {pageTranslate,wordAnimate, originalHeight } = this.state;
    const bgstyle = wordAnimate?{transition:'background-position-y 1s ease',backgroundPositionY:'80%'}:null;
    return (
      <React.Fragment>
        <div  className="root-bg" style={bgstyle}>
          <div className='checkinPage' style={{transition:'top 1s ease',top:pageTranslate?'-50%':'50%'}}>
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
              <img className='checkinbtn' src={checkin} onTouchStart={this.handleClick}></img>
              <div className='smline'>
                <img  src={smline} ></img>
              </div>
            </div>
            <div style={{height:'1.2%'}}></div>
            <div className='gxline'>
              <img src={gxline}></img>
            </div>
          </div>
          <CheckSub {...this.state} {...this.props} getchildRef={this.getchildRef} style={{transition:'top 1s ease',top:pageTranslate?'50%':'150%'}}/>
          {/* <div style={{overflowY:'auto',transition:'transform 1s ease',transform:`translateY(${pageTranslate})`}}><CheckSub {...this.state} {...this.props} getchildRef={this.getchildRef}/></div> */}
        </div>
      </React.Fragment>
    );
  }
}
  