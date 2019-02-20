import React from 'react';
import './index.less';
import Echo from "laravel-echo"
window.io = require('socket.io-client');
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';
import arrow from 'public/luckdraw/name.png';
const echo = new Echo({
  broadcaster: 'socket.io',
  host: '112.74.177.132' + ':6001'
});
export default class DrawView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      totalName: null,//参与抽奖人员
      luckName : null,//本轮获奖人员
      luckAvatar: checkin,
      animateRoteId: null,
      arrayNum: [checkin,triangle],
      arraySum: 0,
      animateCircle : null,//控制圆环动画
      circleIsvisible : true,//控制圆环显示
      arrowIsvisible: null,//控制箭头动画

    }
  }
  componentDidMount(){
    // this.showAvatar(700); 
    echo.channel('draw')
      .listen('DrawStart', (arg) => {
        clearTimeout(this.state.animateRoteId);
        this.state.circleIsvisible = true;
        this.state.animateCircle = true;
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.showLuck(400); 

      }).listen('DrawStop', (arg) => {
        clearTimeout(this.state.animateRoteId);
        this.state.circleIsvisible = null;
        this.state.arraySum = 0;
        this.state.luckName = arg['users'];
        console.log(arg.data);
        console.log(this.state.luckName,33);
        this.showWinluck(700);
      })
      .listen('DrawContinue', (arg) => {
        clearTimeout(this.state.animateRoteId);
        this.state.circleIsvisible = true;
        this.state.animateCircle = true;
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.showLuck(400); 
      });
      echo.channel('winner')
        .listen('WinnerAbandon', (arg) => {
          console.log(arg);
          this.state.luckName = arg.data['0'];
          this.setState({
            luckAvatar:this.state.luckName[this.state.luckName.length-1]
          })

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

  showLuck = (timeout) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    // console.log(this.state.totalName[this.state.arraySum]['avatar'],333);
    if(this.state.arraySum >=this.state.totalName.length){
        this.state.arraySum = 0;
    }
    this.setState({
      arraySum:this.state.arraySum + 1,
      luckAvatar:this.state.totalName[this.state.arraySum]['avatar']
    });
    const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showLuck(timeout);
      },timeout);
  }

   showWinluck = (timeout) => {
      if(this.state.arraySum < this.state.luckName.length){
        this.setState({
          arraySum:this.state.arraySum + 1,
          luckAvatar:this.state.luckName[this.state.arraySum]
        });
        const that = this;
        this.state.animateRoteId = setTimeout(function(){
          that.showWinluck(timeout);
        },timeout);
      }else{
        clearTimeout(this.state.animateRoteId)
      }
   }

  showWineprize = (timeout) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    if(this.state.arraySum < this.state.luckName.length){
      this.setState({
        arraySum:this.state.arraySum + 1,
        luckAvatar:this.state.luckName[this.state.arraySum]
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

  makeArrow = () => {
    let items = [];
    // for
    return <img src={arrow}></img>
  }
  render(){
    const {luckName, luckAvatar ,animateCircle, circleIsvisible, arrowIsvisible} = this.state;
    console.log(luckAvatar,'render');
    const prizerote = circleIsvisible?(<div className='prizerote-bg' style={{animation:animateCircle?'spin 1s linear infinite':'spin .5s linear infinite'}}>
                </div>) : null;
    const  showImg = circleIsvisible?(<img src={luckAvatar}></img>):(<img style={{animation:'spinrote 2s ease infinite'}} src={luckAvatar}></img>)
    const arrowEle = arrowIsvisible?(<div className='arrow'>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
                  </div>):null;
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
               <div className='prizedraw-container'>
                  <div className='prizerote'>
                    {prizerote}
                    <div className='prizeavatar'>
                      {showImg}
                    </div>
                  </div>
                  <div className='arrow'>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
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