import React from 'react';
import './index.less';
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';

export default class DrawView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      luckName : null,
      animateRoteId:null,
      arrayNum:[checkin,triangle],
      arraySum:0,
    }
  }
  componentDidMount(){
    this.showAvatar(700);
  }

  showAvatar = (timeout) =>{
    // let imgNum = Math.floor(Math.random()*2)+1;
    if(this.state.arraySum < this.state.arrayNum.length-1){
      this.setState({
        arraySum:this.state.arraySum+1,
        luckName:this.state.arrayNum[this.state.arraySum+1]
      })
    }else{
      this.setState({
        arraySum:0,
        luckName:this.state.arrayNum[0]
      })
    }
    console.log(timeout);
      const that = this;
      this.state.animateRoteId = setTimeout(function(){
        that.showAvatar(timeout);
      },timeout);
  }
  render(){
    const {luckName } = this.state;
    return(
      <React.Fragment>
        <div className='prize'>
            <div className="explain">
                <div className='explainimg'></div>
                <div className='explaintext'></div>
            </div>
            <div className='prizedraw'>
              <div className='prizerote'>
                <div className='prizerote-bg'>
                </div>
                <div className='prizeavatar'>
                  <img src={luckName}></img>
                </div>
              </div>
              <div className="prizename">
                {/* {luckName} */}
              </div>
            </div>
        </div>
        <div className='namelist'>
        </div>
      </React.Fragment>
    ) 
  }
}