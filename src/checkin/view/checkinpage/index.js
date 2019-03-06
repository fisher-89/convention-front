import React, { Suspense } from 'react';
import { Toast } from 'antd-mobile';
import CheckForm from './checkform';
import CheckSub from './checksub';
import CradList from './cardlist';

export default class CheckinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTranslate: null,
      wordAnimate: null,
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    const curTime = new Date().getTime();
    const startTime = new Date('2019/03/07 00:00:00').getTime();
    if (curTime >= startTime) {
      this.setState({
        pageTranslate: 1,
        wordAnimate: true,
      })
    } else {
      Toast.info('签到尚未开始，请于2019-03-07后签到');
    }
  }

  handleShowlist = () => {
    this.setState({
      pageTranslate: -1,
    })
  }

  render() {
    const { wordAnimate } = this.state;
    const { screenHeight } = this.props;
    const bgstyle = wordAnimate ? { transition: 'background-position-y 1s ease', backgroundPositionY: 'bottom' } : null;
    return (<div className="root-bg" style={{ ...bgstyle, height: `${screenHeight}px` }}>
      <CheckForm handleClick={this.handleClick}  {...this.state} {...this.props} />
      <CheckSub Showlist={this.handleShowlist} {...this.props} {...this.state} />
      <CradList {...this.state} {...this.props} />
    </div>)
  }
}
  