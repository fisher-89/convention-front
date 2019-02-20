import React,{Suspense } from 'react';
import Loading from './loading';
import CheckForm from './checkform';
import CheckSub from './checksub';
import LookOver from './lookover';

export default class CheckIn extends React.Component {
   constructor(props){
      super(props);
   }

   componentDidMount(){
      document.addEventListener("touchmove",this.handleMove);
   }
  
   componentWillUnmount(){
      document.removeEventListener("touchmove",this.handleMove);
   }


  handleMove = (e) => {
    e.preventDefault();
    return;
  }
   render(){
    const name = localStorage.getItem('check_name');
    const avatar = localStorage.getItem('check_avatar');
    return name&&avatar?(<React.Fragment>
          <Suspense fallback={<Loading/>}>
            <LookOver Move={this.handleMove}/>
          </Suspense>
        </React.Fragment>):(<React.Fragment>
                          <Suspense fallback={<Loading/>}>
                            <CheckForm Move={this.handleMove}/>
                          </Suspense>
                        </React.Fragment>)
   }
}
  