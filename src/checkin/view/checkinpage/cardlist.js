import React from 'react';
import './cardlist.less';

const listName = [
  ['14:00','开场白'],
  ['14:14','铁军宣誓仪式'],
  ['14:22','开幕致辞'],
  ['14:32','各品牌军令状'],
  ['14:52','晏总分享'],
  ['15:12','时装走秀'],
  ['15:32','员工颁奖'],
  ['15:57','喜哥分享'],
  ['16:30','客户颁奖'],
  ['16:45','新省代客户授牌'],
  ['16:45','感恩环节'],
  ['17:05','大壮演唱'],
  ['17:07','分红'],
  ['17:27','《我们在一起》大合唱']
]

export default class CardList extends React.PureComponent{
  
  makeList = () => {
    let items = [];
    const interval = 5.968;
    const positionTop = 6.45;//0.12419 .05968
    for(let i =0; i<listName.length; i+=1){
      items.push(<div key={i} className='listitem' style={{top:`${interval*i+positionTop}%`}}>{listName[i][1]}</div>)
    }
    return items;
  }

  render(){
    const {pageTranslate,pageHeight, pageWidth} = this.props;
    const pageStyle = pageWidth?{height:`${pageHeight}px`,width:`${pageWidth}px`,marginLeft:`-${pageWidth/2}px`,marginTop:`-${pageHeight/2}px`}:null;
    const fontsize = pageWidth * .04375;
    const tileFontsize = pageWidth * .05;
    return(
      <div className='cardlistPage' style={{transition:'top 1s ease',top:pageTranslate=='-1'?'50%':'150%',...pageStyle}}>
         <div className='title' style={{fontSize:`${tileFontsize}px`}}>—— 节目单 ——</div>
         <div className='list' style={{fontSize:`${fontsize}px`}}>
            {this.makeList()}
         </div>
      </div>
    )
  }
}