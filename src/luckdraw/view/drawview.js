import React from 'react';
import './index.less';
import axios from 'axios';
import Echo from "laravel-echo"
window.io = require('socket.io-client');
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';
import arrow from 'public/luckdraw/name.png';
const echo = new Echo({
  broadcaster: 'socket.io',
  host: '112.74.177.132:6001'
  // host: '192.168.1.166:6001'
});
export default class DrawView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showName:null,
      totalName: null,//参与抽奖人员
      luckName : [],//本轮获奖人员
      luckAvatar: null,
      animateRoteId: null,
      arrayNum: [checkin,triangle],
      arraySum: 0,
      luckNameSum:0,
      animateCircle : null,//控制圆环动画
      circleIsvisible : null,//控制圆环显示
      arrowIsvisible: null,//控制箭头动画
      animateRoteNumber: null,
      award: null,//奖品展示
      awardNum: null,
      showLuckImg : null,
    }
  }
  componentDidMount(){
    axios.get('/api/new_configuration')
      .then(res => {
        console.log(res.status);
        if(res.status == '200'){
          this.setPrize(res['data']['data']['award'],res['data']['data']['persions'])
          this.state.totalName = res['data']['users'];
          this.state.arraySum = 0;
          this.setAnimaterote(true,true,false);
          this.setLucklist(res['data']['data']['winners'],res['data']['data']['winners'].length);
          this.showAvatar(800);
        }
      })
      .catch(err => {
          console.log(err,"请求失败，出现异常，请重新打开网页");
      })
    echo.channel('configuration')
      .listen('ConfigurationSave', (arg) => {
          this.setPrize(arg['data']['award'],arg['data']['persions']); 
          this.setAnimaterote(true,true,false);
          this.setLucklist(null,0);
          this.state.showName = null;
          this.state.arraySum = 0;
          this.state.totalName = arg['users'];
          this.showAvatar(700);
      })
      .listen('ConfigurationUpdate', (arg) =>  {
          this.setPrize(arg['data']['award'],arg['data']['persions']); 
          this.setAnimaterote(true,true,false);
          this.setLucklist(null,0);
          this.state.showName = null;
          this.state.arraySum = 0;
          this.state.totalName = arg['users'];
          this.showAvatar(700);
      })

    echo.channel('draw')
      .listen('DrawStart', (arg) => {
        clearTimeout(this.state.animateRoteId);
        //设置奖品
        this.setPrize( arg['data']['award'],arg['data']['persions']);
        //设置中奖name
        this.setLucklist(null,0);
        //设置rote区
        this.setAnimaterote(true,true,true);
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.showLuck(400); 

      }).listen('DrawStop', (arg) => {
        clearTimeout(this.state.animateRoteId);
        let {luckName} = this.state;
        this.state.arraySum = luckName?luckName.length:0;
        this.setAnimaterote(false,false,false);
        const luckUsers = luckName?[...luckName,...arg['users']]:arg['users'];
        const luckNum = luckName ?luckName.length-1 : -1;
        this.state.animateRoteNumber = arg['users'].length;
        this.setLucklist(luckUsers,luckNum);
        localStorage.setItem('luckName',this.state.luckName);
        this.state.totalName = null;
        this.showWinluck(2000);
      })
      .listen('DrawContinue', (arg) => {
        clearTimeout(this.state.animateRoteId);
        this.setAnimaterote(true,true,true);
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.showLuck(400); 
      });
      echo.channel('winner')
        .listen('WinnerAbandon', (arg) => {
          //重新设置luckname
          //设置arraySum
          let {luckName } = this.state;
          if(!luckName.length){
            luckName = localStorage.getItem('luckName'); 
          }
          for(let i = 0; i < luckName.length; i+=1){
            if(luckName[i]['openid'] == arg['data']['openid']){
               luckName.splice(i,1)
            }
          }
          this.setLucklist(luckName,luckName.length);
          this.setState({
            showName: null,
          })
          // this.setState({
          //   luckAvatar:this.state.luckName[this.state.luckName.length-1]
          // })
        })
    
    
  }

  setPrize = (award,persions)=> {
    this.state.award = award;
    this.state.awardNum = persions;
  }

  setLucklist = (luckName, luckNum)=> {
    this.state.luckName = luckName;
    this.state.luckNameSum = luckNum;
  }

  setAnimaterote = (circleIsvisible,animateCircle,arrowIsvisible) => {
    this.state.circleIsvisible = circleIsvisible;
    this.state.animateCircle = animateCircle;
    this.state.arrowIsvisible = arrowIsvisible;
  }
  showAvatar = (timeout) =>{
    if(this.state.arraySum >=this.state.totalName.length){
      this.state.arraySum = 0;
    }
    this.setState({
      arraySum:this.state.arraySum + 1,
      luckAvatar:this.state.totalName[this.state.arraySum]['avatar']
    });
    const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showAvatar(timeout);
      },timeout);
  }

  showLuck = (timeout) =>{
    if(this.state.arraySum >=this.state.totalName.length){
        this.state.arraySum = 0;
    }
    this.setState({
      arraySum:this.state.arraySum + 1,
      luckAvatar:this.state.totalName[this.state.arraySum]['avatar'],
      showName:this.state.totalName[this.state.arraySum]['name']
    });
    const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showLuck(timeout);
      },timeout);
  }

   showWinluck = (timeout) => {
      if(this.state.arraySum < this.state.luckName.length){
        this.state.luckNameSum += 1;
        this.setState({
          arraySum:this.state.arraySum + 1,
          luckAvatar:this.state.luckName[this.state.arraySum]['avatar'],
          showName :this.state.luckName[this.state.arraySum]['name'],
          showLuckImg:!this.state.showLuckImg
        });
        const that = this;
        this.state.animateRoteId = setTimeout(function(){
          that.showWinluck(timeout);
        },timeout);
      }else{
        this.setState({
          circleIsvisible:false,
          luckNameSum:this.state.luckNameSum + 1
        })
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
        that.showWineprize(timeout);
      },timeout);
    }else{
      clearTimeout(this.state.animateRoteId)
    }
  }

  makeShowlist = (listname) => {
    //listname 中奖人数
    const {awardNum } = this.state;
    let items = [];
    for(let i = 0; i< awardNum; i+=1){
       if(i < listname){
          items.push(<div className='hoveritem' key={i}><img src={this.state.luckName[i]['avatar'] || this.state.luckName[i]['sign']['avatar']}></img></div>)
       }else{
          items.push(<div className='deafultitem' key={i}></div>)
       }
    }
    return (<div>{items}</div>)
  }

  render(){
    const  {luckName, showName,luckAvatar ,animateCircle, arraySum,
          circleIsvisible, arrowIsvisible, luckNameSum,
          award ,awardNum ,showLuckImg,animateRoteNumber } = this.state;
    const  prizerote = circleIsvisible?(<div className='prizerote-bg' style={{animation:animateCircle?'spin 1.5s linear infinite':'spin .5s linear infinite'}}>
                </div>) : null;
    const  showImg = circleIsvisible?(<img src={luckAvatar}></img>):(<img style={{animation:`spinrote 2s ease ${animateRoteNumber}`}} src={luckAvatar}></img>)
    const  arrowEle = arrowIsvisible?(<div className='arrow'>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
                      <img src={arrow}></img>
                  </div>):null;
    // const  nameList  = this.makeShowlist(luckNameSum);
    
    const  awardEle = award?(<div className="explain">
                <div className='explainimg'>
                  <img src={award['url']}></img>
                </div>
                <div className='explaintext'>
                   <div className='machine'>
                   {award['name']}
                   </div> 
                    <div className='number'>数量:&nbsp; {awardNum}</div>
                </div>
            </div>):null;
    if(!award) return null;       
    return(
      <React.Fragment>
        <div className='prize'>
            <div className="explain">
                <div className='explainimg'>
                  <img src={award['url']}></img>
                </div>
                <div className='explaintext'>
                   <div className='machine'>
                   {award['name']}
                   </div> 
                    <div className='number'>数量:&nbsp; {awardNum}</div>
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
                  {arrowEle}  
               </div>
              <div className="prizename">
                {showName}
              </div>
            </div>
        </div>
        <div className='namelist'>
          {this.makeShowlist(luckNameSum)}
        </div>
      </React.Fragment>
    ) 
  }
}