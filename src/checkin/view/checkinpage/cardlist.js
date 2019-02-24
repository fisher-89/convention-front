import React from 'react';
import './cardlist.less';

const listName = [
  '开场白',
  '铁军宣誓仪式',
  '开幕致辞',
  '各品牌军令状',
  '晏总分享',
  '时装走秀',
  '员工颁奖',
  '喜哥分享',
  '客户颁奖',
  '新省代客户授牌',
  '感恩环节',
  '大壮演唱',
  '分红',
  '《我们在一起》大合唱'
]

export default class CardList extends React.PureComponent{
  
  makeList = () => {
    let items = [];
    const interval = 5.968;
    const positionTop = 6.45;//0.12419 .05968
    for(let i =0; i<listName.length; i+=1){
      items.push(<div key={i} className='listitem' style={{top:`${interval*i+positionTop}%`}}>{listName[i]}</div>)
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