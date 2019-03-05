import React from 'react';
import './index.less';
import axios from 'axios';
import Echo from "laravel-echo";
import { env } from '../../util';

window.io = require('socket.io-client');
import checkin from 'public/checkin/checkin.png';
import triangle from 'public/checkin/triangle.png';
import arrow from 'public/luckdraw/name.png';

const echo = new Echo({
  broadcaster: 'socket.io',
  host: env('SOCKET_HOST'),
});
export default class DrawView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showName: null,
      showNumber: null,
      totalName: null,//参与抽奖人员
      luckName: [],//本轮获奖人员
      luckAvatar: null,
      arrayNum: [checkin, triangle],
      arraySum: 0,
      luckNameSum: 0,
      circleIsvisible: null,//控制圆环显示
      timePerCircle: 1.5,
      circleRotate: -360 * 200,
      arrowIsvisible: null,//控制箭头动画
      animateRoteNumber: null,
      award: null,//奖品展示
      awardNum: null,
      showLuckImg: null,
    }
  }

  circle = {
    type: 'showAvatar',
    interval: 800,
    delay: 0,
    min: null,
    max: null,
  }

  componentDidMount() {
    axios.get('/api/new_configuration')
      .then(res => {
        if (res.status == '200') {
          this.setPrize(res['data']['data']['award'], res['data']['data']['persions']);
          this.state.totalName = res['data']['users'];
          this.state.arraySum = 0;
          this.setAnimaterote(true, false);
          this.setLucklist(res['data']['data']['winners'], res['data']['data']['winners'].length);
          if (res.data.data.is_progress) {
            this.setCircle('showLuck', 250);
          } else {
            this.showAvatar();
          }
        }
      })
      .catch(err => {
        console.log(err, "请求失败，出现异常，请重新打开网页");
      });
    echo.channel('configuration')
      .listen('ConfigurationSave', (arg) => {
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        this.setAnimaterote(true, false);
        this.setLucklist(null, 0);
        this.state.showName = null;
        this.state.showNumber = null;
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.setCircle('showAvatar');
      })
      .listen('ConfigurationUpdate', (arg) => {
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        this.setAnimaterote(true, false);
        this.setLucklist(null, 0);
        this.state.showName = null;
        this.state.showNumber = null;
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.setCircle('showAvatar');
      })

    echo.channel('draw')
      .listen('DrawStart', (arg) => {
        //设置奖品
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        //设置中奖name
        this.setLucklist([], 0);
        //设置rote区
        this.setAnimaterote(true, true);
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.setCircle('showLuck', 600, -100, 250);
      })
      .listen(
        'DrawStop',
        (arg) => {
          console.log('stop');
          this.setCircle('showLuck', 300, 300);
          setTimeout(() => {
            let { luckName } = this.state;
            this.state.arraySum = luckName ? luckName.length : 0;
            this.setAnimaterote(false, false);
            const luckUsers = luckName ? [...luckName, ...arg['users']] : arg['users'];
            const luckNum = luckName ? luckName.length - 1 : -1;
            this.state.animateRoteNumber = arg['users'].length;
            this.setLucklist(luckUsers, luckNum);
            localStorage.setItem('luckName', this.state.luckName);
            this.state.totalName = null;
            this.setCircle('showWinluck', 2000);
          }, 1500);
        }
      )
      .listen('DrawContinue', (arg) => {
        this.setAnimaterote(true, true);
        this.state.arraySum = 0;
        this.state.totalName = arg['users'];
        this.setCircle('showLuck', 250);
      });
    echo.channel('winner')
      .listen('WinnerAbandon', (arg) => {
        //重新设置luckname
        //设置arraySum
        let { luckName } = this.state;
        if (!luckName.length) {
          luckName = localStorage.getItem('luckName');
        }
        for (let i = 0; i < luckName.length; i += 1) {
          if (luckName[i]['openid'] == arg['data']['openid']) {
            luckName.splice(i, 1)
          }
        }
        this.setLucklist(luckName, luckName.length);
        this.setState({
          showName: null,
          showNumber: null,
        })
      })
  }

  setCircle = (type, interval = 800, delay = 0, min = null, max = null) => {
    console.log(this.animateTimeout);
    this.circle = { type, interval, delay, min, max };
    if (!this.animateTimeout) {
      this[type]();
    }
  }

  setPrize = (award, persions) => {
    this.setState({
      award: award,
      awardNum: persions,
    })
  }

  setLucklist = (luckName, luckNum) => {
    this.state.luckName = luckName;
    this.state.luckNameSum = luckNum;
  }

  setAnimaterote = (circleIsvisible, arrowIsvisible) => {
    this.state.circleIsvisible = circleIsvisible;
    this.state.arrowIsvisible = arrowIsvisible;
  }
  showAvatar = () => {
    if (this.state.arraySum >= this.state.totalName.length) {
      this.state.arraySum = 0;
      this.state.totalName.sort(() => 0.5 - Math.random())
    }
    this.state.timePerCircle = this.circle.interval / 1000;
    this.state.circleRotate += 160;
    this.setState({
      arraySum: this.state.arraySum + 1,
      luckAvatar: this.state.totalName[this.state.arraySum]['avatar']
    });
    this.animateTimeout = setTimeout(() => {
      this[this.circle.type]();
    }, this.circle.interval);
  }

  showLuck = () => {
    if (this.state.arraySum >= this.state.totalName.length) {
      this.state.arraySum = 0;
      this.state.totalName.sort(() => 0.5 - Math.random())
    }
    this.circle.interval += this.circle.delay;
    if (this.circle.max && this.circle.interval >= this.circle.max) this.circle.interval = this.circle.max;
    if (this.circle.min && this.circle.interval <= this.circle.min) this.circle.interval = this.circle.min;
    this.state.timePerCircle = this.circle.interval / 1000;
    this.state.circleRotate += 100;
    this.setState({
      arraySum: this.state.arraySum + 1,
      luckAvatar: this.state.totalName[this.state.arraySum]['avatar'],
      showName: this.state.totalName[this.state.arraySum]['name'],
      showNumber: this.state.totalName[this.state.arraySum]['number']
    });
    this.animateTimeout = setTimeout(() => {
      this[this.circle.type]();
    }, this.circle.interval);
  }

  showWinluck = () => {
    if (this.state.arraySum < this.state.luckName.length) {
      this.state.luckNameSum += 1;
      this.setState({
        arraySum: this.state.arraySum + 1,
        luckAvatar: this.state.luckName[this.state.arraySum]['avatar'],
        showName: this.state.luckName[this.state.arraySum]['name'],
        showNumber: this.state.luckName[this.state.arraySum]['number'],
        showLuckImg: !this.state.showLuckImg
      });
      this.animateTimeout = setTimeout(() => {
        this[this.circle.type]();
      }, this.circle.interval);
    } else {
      this.setState({
        circleIsvisible: false,
        luckNameSum: this.state.luckNameSum + 1
      })
      clearTimeout(this.animateTimeout);
      this.animateTimeout = null;
    }
  }

  showWineprize = (timeout) => {
    if (this.state.arraySum < this.state.luckName.length) {
      this.setState({
        arraySum: this.state.arraySum + 1,
        luckAvatar: this.state.luckName[this.state.arraySum]
      });
      const that = this;
      this.animateTimeout = setTimeout(function () {
        that.showWineprize(timeout);
      }, timeout);
    } else {
      clearTimeout(this.animateTimeout);
      this.animateTimeout = null;
    }
  }

  makeShowlist = (listname) => {
    //listname 中奖人数
    const { awardNum } = this.state;
    let items = [];
    for (let i = 0; i < awardNum; i += 1) {
      if (i < listname) {
        items.push(<div className='hoveritem' key={i}>
          <div className='itemimg'>
            <img src={this.state.luckName[i]['avatar'] || this.state.luckName[i]['sign']['avatar']} />
          </div>
          <div className='itemtext'>
            {this.state.luckName[i]['name'] || this.state.luckName[i]['sign']['name']}<br />
            {this.state.luckName[i]['number'] || this.state.luckName[i]['sign']['number']}
          </div>
        </div>)
      } else {
        items.push(<div className='deafultitem' key={i}></div>)
      }
    }
    return (<div>{items}</div>)
  }

  render() {
    const {
      showName, showNumber, luckAvatar,
      circleIsvisible, timePerCircle, circleRotate,
      arrowIsvisible, luckNameSum,
      award, awardNum, animateRoteNumber,
    } = this.state;
    const prizerote = circleIsvisible ? (
      <div
        className='prizerote-bg'
        style={{ transition: `transform ${timePerCircle}s linear`, transform: `rotate(${circleRotate}deg)` }}
      />
    ) : null;
    const showImg = circleIsvisible ? (<img src={luckAvatar}></img>) : (
      <img style={{ animation: `spinrote 2s ease ${animateRoteNumber}` }} src={luckAvatar}></img>
    );
    const arrowEle = arrowIsvisible ? (
      <div className='arrow'>
        <img src={arrow}></img>
        <img src={arrow}></img>
        <img src={arrow}></img>
      </div>
    ) : null;

    if (!award) return null;
    return (
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
              {showName}<br />
              {showNumber}
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