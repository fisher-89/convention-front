import React from 'react';
import './cardlist.less';
import titleImage from 'public/checkin/program_title.png';

const listName = [
  ['01/', '14:00', '开场舞'],
  ['02/', '14:11', '奏唱国歌'],
  ['03/', '14:13', '开幕致辞'],
  ['04/', '14:23', '铁军宣誓仪式'],
  ['05/', '14:31', '创创晏总分享'],
  ['06/', '14:51', '时装走秀'],
  ['07/', '15:11', '员工颁奖'],
  ['08/', '15:36', '喜哥演唱×分享'],
  ['09/', '16:14', '客户/厂家颁奖'],
  ['10/', '16:29', '省代、市代授证仪式'],
  ['11/', '16:34', '感恩环节'],
  ['12/', '16:44', '大壮演唱'],
  ['13/', '16:56', '分红'],
  ['14/', '17:18', '各品牌军令状'],
  ['15/', '17:38', '大合唱'],
]

export default class CardList extends React.PureComponent {

  makeList = () => {
    let items = [];
    const positionTop = 3;
    const interval = (98 - positionTop) / listName.length; //6.8
    for (let i = 0; i < listName.length; i += 1) {
      items.push(
        <div key={i} className='listitem' style={{ top: `${interval * i + positionTop}%` }}>
          <span className='number'>{listName[i][0]}</span>
          <span className='time'>{listName[i][1]}</span>
          <span className='content'>{listName[i][2]}</span>
        </div>
      );
    }
    return items;
  }

  render() {
    const { pageTranslate, pageHeight, pageWidth } = this.props;
    const pageStyle = pageWidth ? {
      height: `${pageHeight}px`,
      width: `${pageWidth}px`,
      marginLeft: `-${pageWidth / 2}px`,
      marginTop: `-${pageHeight / 2}px`
    } : null;
    const fontsize = pageWidth * .04375;
    const programBorderRadius = pageWidth * 0.05;
    return (
      <div
        className='cardlistPage'
        style={{ transition: 'top 1s ease', top: pageTranslate == '-1' ? '50%' : '150%', ...pageStyle }}
      >
        <div className='title'>
          <img src={titleImage} />
        </div>
        <div className='list' style={{ fontSize: `${fontsize}px`, borderRadius: `${programBorderRadius}px` }}>
          {this.makeList()}
        </div>
      </div>
    )
  }
}