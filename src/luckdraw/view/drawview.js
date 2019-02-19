import React from 'react';
import './index.less';
import Echo from "laravel-echo"
window.io = require('socket.io-client');
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';
const echo = new Echo({
  broadcaster: 'socket.io',
  host: '112.74.177.132' + ':6001'
});
export default class DrawView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      luckName : null,
      luckAvatar: checkin,
      animateRoteId: null,
      arrayNum: [checkin,triangle],
      arraySum: 0,
      animateCircle : true,//控制圆环动画
      circleIsvisible : true,//控制圆环显示
    }
  }
  componentDidMount(){
    // this.showAvatar(700); 
    echo.channel('draw')
      .listen('DrawStart', (arg) => {
        clearTimeout(this.state.animateRoteId);
        console.log(arg);
        this.state.circleIsvisible = true;
        this.state.animateCircle = null;
        this.state.arraySum = 0,
        this.showLuck(600,arg['users']); 

      })
      .listen('DrawStop', (arg) => {
        clearTimeout(this.state.animateRoteId);
        this.state.circleIsvisible = null;
        console.log(arg);
        this.showWinluck(700,arg.data['winners']);
      })
      .listen('DrawContinue', (arg) => {
        this.state.circleIsvisible = true;
        this.state.animateCircle = null;
          console.log(arg);
          this.showLuck(600,arg['users']); 
      });
      echo.channel('winner')
        .listen('WinnerAbandon', (arg) => {
        })
    
    
  }

  showAvatar = (timeout) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    if(this.state.arraySum < this.state.arrayNum.length){
      this.setState({
        arraySum:this.state.arraySum + 1,
        luckAvatar:this.state.arrayNum[this.state.arraySum]
      })
    }else{
      this.setState({
        arraySum:1,
        luckAvatar:this.state.arrayNum[0]
      })
    }
    const that = this;
    this.state.animateRoteId = setTimeout(function(){
      that.showAvatar(timeout);
    },timeout);
  }

  showLuck = (timeout, listname) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    if(this.state.arraySum < listname.length){
      this.setState({
        arraySum:this.state.arraySum + 1,
        luckAvatar:listname[this.state.arraySum]['avatar']
      });
      const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showAvatar(timeout);
      },timeout);
    }else{
      clearTimeout(this.state.animateRoteId)
    }
  }

   showWinluck = (timeout, listname) => {
      if(this.state.arraySum < listname.length){
        this.setState({
          arraySum:this.state.arraySum + 1,
          luckAvatar:listname[this.state.arraySum]
        });
        const that = this;
        this.state.animateRoteId = setTimeout(function(){
          that.showAvatar(timeout);
        },timeout);
      }else{
        clearTimeout(this.state.animateRoteId)
      }
   }

  showWineprize = (timeout, listname) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    if(this.state.arraySum < listname.length){
      this.setState({
        arraySum:this.state.arraySum + 1,
        luckAvatar:listname[this.state.arraySum]
      });
      const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showAvatar(timeout);
      },timeout);
    }else{
      clearTimeout(this.state.animateRoteId)
    }
  }

  makeShowlist = (listname=[1]) => {
    let items = [];
    for(let i = 0; i< 10 ; i+=1){
       if(i < listname.length){
          items.push(<div className='hoveritem' key={i}><img src={checkin}></img></div>)
       }else{
          items.push(<div className='deafultitem' key={i}></div>)
       }
    }
    return (<div>{items}</div>)
  }

  render(){
    const {luckName, luckAvatar ,animateCircle, circleIsvisible} = this.state;
    const prizerote = circleIsvisible?(<div className='prizerote-bg' style={{animation:animateCircle?'spin 1s linear infinite':'spin .5s linear infinite'}}>
                </div>) : null;
    const  showImg = !circleIsvisible?(<img src={luckAvatar}></img>):(<img style={{animation:'spinrote 2s ease infinite'}} src={luckAvatar}></img>)
    return(
      <React.Fragment>
        <div className='prize'>
            <div className="explain">
                <div className='explainimg'>
                  <img src={triangle}></img>
                </div>
                <div className='explaintext'>
                   <div className='machine'>
                   iPhone XS MAX 512G iPhone XS MAX 512G 
                   </div> 
                    <div className='number'>数量:&nbsp; {10}</div>
                </div>
            </div>
            <div className='prizedraw'>
              <div className='prizerote'>
                {prizerote}
                <div className='prizeavatar'>
                  {showImg}
                </div>
              </div>
              <div className="prizename">
                {/* {luckName} */}
              </div>
            </div>
        </div>
        <div className='namelist'>
          {this.makeShowlist()}
        </div>
      </React.Fragment>
    ) 
  }
}