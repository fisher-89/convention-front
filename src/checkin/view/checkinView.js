import React,{Suspense } from 'react';
import Loading from './loading';
import LookoverPage from './lookoverpage/index';
import CheckinPage from './checkinpage/index';

const minScale = 0.4;
const maxScale = 0.52;
export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
      this.state = {
        pageHeight: null,
        pageWidth: null,
        pageMargin: null,
        screenHeight: null,
      }
   }

   componentWillMount(){
    this.setPageheight();
    this.state.screenHeight = this.originalHeight;
   }
   componentDidMount(){
     const that = this;
     document.addEventListener("touchmove",this.handleMove);
      // const minScale = 0.4;
      // const maxScale = 0.7
      // const originalHeight = document.documentElement.clientHeight ||document.body.clientHeight;
      // const originalWidth = document.documentElement.clientWidth ||document.body.clientWidth;
      // const scale = originalWidth / originalHeight;
      // if(scale > 0.4 && scale < 0.7){
      //    this.state.pageHeight = originalHeight;
      //   //  this.state.pageWidth = originalWidth;
      //    this.setState({
      //     pageWidth: originalWidth*.9
      //    })
      // }

   }
  
  componentWillUnmount(){
      document.removeEventListener("touchmove",this.handleMove);
   }
  handleOrientation = (e) => {
    console.log(3333);
    e.preventDefault();
    this.setPageheight();
    this.setState({
      screenHeight:this.originalHeight,
    })
  }

  setPageheight = () => {
    this.originalHeight = document.documentElement.clientHeight ||document.body.clientHeight;
    this.originalWidth = document.documentElement.clientWidth ||document.body.clientWidth;
    const scale = this.originalWidth / this.originalHeight;
    console.log(scale,window.devicePixelRatio,'比例');
    console.log(this.originalWidth,55);
    if(scale > minScale && scale < maxScale){
       this.state.pageHeight = this.originalHeight;
       this.state.pageWidth = this.originalWidth*.9;
    }else if(scale > maxScale){
      this.state.pageHeight= this.originalHeight;
      this.state.pageWidth = this.originalHeight * maxScale * .9;
    }else if(scale < minScale){
      this.state.pageWidth = this.originalWidth*.9;
      this.state.pageHeight = this.originalWidth / minScale;
      this.state.pageMargin = this.originalHeight - this.originalWidth / minScale;
    }
  } 

  handleMove = (e) => {
    e.preventDefault();
    console.log(333);
    return;
  }
   render(){
    const name = localStorage.getItem('check_name');
    const avatar = localStorage.getItem('check_avatar');
    return name&&avatar?(<React.Fragment>
          <Suspense fallback={<Loading/>}>
            <LookoverPage Move={this.handleMove}/>
          </Suspense>
        </React.Fragment>):(<React.Fragment>
                          <Suspense fallback={<Loading/>}>
                            <CheckinPage Move={this.handleMove} {...this.state} height={this.state.screenHeight}/>
                          </Suspense>
                        </React.Fragment>)
   }
}
  