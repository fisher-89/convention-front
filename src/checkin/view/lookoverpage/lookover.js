import React from 'react';
// import './checkform.less';
import './lookover.less';
import logo from 'public/checkin/logo.png';
import xjimg from 'public/checkin/xjimg.png';
import viewjm from 'public/checkin/viewjm.png';
import gxline from 'public/checkin/gxline.png';
import triangle from 'public/checkin/triangle.png';
import smline from 'public/checkin/smline.png';

export default class LookOver extends React.PureComponent {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    document.removeEventListener("touchmove",this.props.Move);
    document.addEventListener("touchmove",this.props.Move);
  }

  handleClick = (e)=>{
    e.preventDefault();
    localStorage.removeItem('check_avatar');
    this.props.Showlist();
  }
  render() {
    const imageSrc= localStorage.getItem('check_avatar');
    const checkName = localStorage.getItem('check_name');
    console.log(imageSrc,checkName,444);
    const {pageTranslate,wordAnimate, originalHeight ,pageHeight, pageWidth} = this.props;
    const pageStyle = pageWidth?{height:`${pageHeight}px`,width:`${pageWidth}px`,marginLeft:`-${pageWidth/2}px`,marginTop:`-${pageHeight/2}px`}:null;
    const fontSize = pageWidth * 0.0474;
    return (
      <div className='lookoverPage' style={{transition:'top 1s ease',top:pageTranslate=='-1'?'-150%':null,...pageStyle}}>
        <div className='logo'>
          <img src={logo}/>
        </div>
        <div className='xjimg'>
          <img src={xjimg}></img>
        </div>
        <div className='showavatar'>
            <img src={logo}/>
        </div>
        <div className='showname' style={{fontSize:`${fontSize}px`}}>
          {checkName}
        </div>
        <div className='viewjm'>
          <div className='viewjm-container'>
            <img className='viewjmbtn' onTouchEnd={this.handleClick} src={viewjm}></img>
            <div className='smline'>
                <img  src={smline} ></img>
            </div>
           </div> 
        </div>
      </div>
    );
  }
}
  