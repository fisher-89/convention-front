import React,{Suspense } from 'react';
import CheckForm from './checkform';
import CheckSub from './checksub';
import CradList from './cardlist';

export default class CheckinPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pageTranslate:null,
      wordAnimate:null,
    }  
  }

  
  handleClick = (e)=>{
    e.preventDefault();
    const originalHeight=document.documentElement.clientHeight ||document.body.clientHeight;
    this.setState({
      pageTranslate:1,
      wordAnimate:true,
      // originalHeight:originalHeight,
    })
  } 

  handleShowlist = () => {
    this.setState({
      pageTranslate:-1,
    })
  }
  handleGetOenId = () => {
    const currentUrl = window.location.href;
    let openId = null;
    try{
      openId = currentUrl.split('?')['1'].split('=')['1']
    }catch(err){
       console.log(err);
    }
    
    return openId;
  }

   render(){
     const {wordAnimate} = this.state;
     const {screenHeight } = this.props;
    const bgstyle = wordAnimate?{transition:'background-position-y 1s ease',backgroundPositionY:'80%'}:null;
    console.log(this.props,333);
    return (<div  className="root-bg" style={{...bgstyle,height:`${screenHeight}px`}}>
        <CheckForm handleClick={this.handleClick}  {...this.state} {...this.props}/>
        <CheckSub  Showlist={this.handleShowlist} {...this.props} {...this.state}/>
        <CradList {...this.state} {...this.props}/>
    </div>)
   }
}
  