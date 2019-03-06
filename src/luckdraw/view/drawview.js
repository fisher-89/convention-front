import React from 'react';
import './index.less';
import axios from 'axios';
import Echo from "laravel-echo";
import { env } from '../../util';

window.io = require('socket.io-client');
import arrow from 'public/luckdraw/name.png';

const echo = new Echo({
  broadcaster: 'socket.io',
  host: env('SOCKET_HOST'),
});
export default class DrawView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0, // 状态：0.待机 1.等待抽奖 2.抽奖中 3.抽奖结束
      participants: [],
      showIndex: 0,
      showData: {
        name: null,
        number: null,
        avatar: null,
      },
      winners: [], // 本轮获奖人员
      showWinners: [], // 已展示的获奖人员
      circleRotate: -360 * 200,
      award: null,//奖品展示
      plannedWinnerNum: 0,
    }
  }

  circle = {
    type: 'showAvatar',
    interval: 800,
    delay: 0,
    min: null,
    max: null,
  };

  componentDidMount() {
    axios.get('/api/new_configuration')
      .then(res => {
        if (res.status === 200 && res.data.data) {
          const { data, users } = res.data;
          this.setPrize(data.award, data.persions);
          this.state.participants = users;
          if (data.winners.length > 0) {
            this.state.showWinners = this.state.winners = data.winners.map(item => ({
              openid: item.openid,
              avatar: item.sign.avatar,
              name: item.sign.name,
              number: item.sign.number,
            }));
            this.state.showData = this.state.winners[data.winners.length - 1];
            this.setState({ status: 3 });
          } else if (data.is_progress) {
            this.setCircle('showLuck', 250);
          } else {
            this.setCircle('showAvatar');
          }
        }
      })
      .catch(err => {
        console.log(err, "请求失败，出现异常，请重新打开网页");
      });
    echo.channel('configuration')
      .listen('ConfigurationSave', (arg) => {
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        this.clearWinners();
        this.state.showIndex = 0;
        this.state.participants = arg['users'];
        this.setCircle('showAvatar');
      })
      .listen('ConfigurationUpdate', (arg) => {
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        this.clearWinners();
        this.state.showIndex = 0;
        this.state.participants = arg['users'];
        this.setCircle('showAvatar');
      });

    echo.channel('draw')
      .listen('DrawStart', (arg) => {
        //设置奖品
        this.setPrize(arg['data']['award'], arg['data']['persions']);
        //设置中奖name
        this.clearWinners();
        //设置rote区
        this.state.showIndex = 0;
        this.state.participants = arg['users'];
        this.setCircle('showLuck', 600, -100, 250);
      })
      .listen(
        'DrawStop',
        (arg) => {
          this.setCircle('showLuck', 300, 300);
          setTimeout(() => {
            let { winners } = this.state;
            this.state.winners = [...winners, ...arg.users];
            this.setCircle('showWinluck', 2000);
          }, 1500);
        }
      )
      .listen('DrawContinue', (arg) => {
        this.state.showIndex = 0;
        this.state.participants = arg['users'];
        this.setCircle('showLuck', 250);
      });
    echo.channel('winner')
      .listen('WinnerAbandon', (arg) => {
        let { winners, showWinners } = this.state;
        const newWinners = [...winners];
        const newShowWinners = [...showWinners];
        winners.forEach((winner, index) => {
          if (winner.openid === arg.data.openid) {
            newWinners.splice(index, 1);
            newShowWinners.splice(index, 1);
            if (newWinners.length === 0) {
              this.setCircle('showAvatar');
            } else if (index === showWinners.length - 1) {
              this.state.showData = newShowWinners[index - 1];
            }
          }
        });
        this.setState({ winners: newWinners, showWinners: newShowWinners });
      })
  }

  setCircle = (type, interval = 800, delay = 0, min = null, max = null) => {
    const statusGroup = { 'showAvatar': 1, 'showLuck': 2, 'showWinluck': 3 };
    this.state.status = statusGroup[type];
    this.circle = { type, interval, delay, min, max };
    if (!this.animateTimeout) {
      this[type]();
      clearTimeout(this.animateTimeout);
      this[type]();
    }
  };

  clearWinners = () => {
    this.setState({ winners: [], showWinners: [] });
  };

  setPrize = (award, persions) => {
    this.setState({
      award: award,
      plannedWinnerNum: persions,
    })
  };

  showAvatar = () => {
    if (this.state.showIndex >= this.state.participants.length) {
      this.state.showIndex = 0;
      this.state.participants.sort(() => 0.5 - Math.random())
    }
    this.state.circleRotate += 160;
    this.setState({
      showIndex: this.state.showIndex + 1,
      showData: this.state.participants[this.state.showIndex],
    });
    this.animateTimeout = setTimeout(() => {
      this[this.circle.type]();
    }, this.circle.interval);
  };

  showLuck = () => {
    if (this.state.showIndex >= this.state.participants.length) {
      this.state.showIndex = 0;
      this.state.participants.sort(() => 0.5 - Math.random())
    }
    this.circle.interval += this.circle.delay;
    if (this.circle.max && this.circle.interval >= this.circle.max) this.circle.interval = this.circle.max;
    if (this.circle.min && this.circle.interval <= this.circle.min) this.circle.interval = this.circle.min;
    this.state.circleRotate += 100;
    this.setState({
      showIndex: this.state.showIndex + 1,
      showData: this.state.participants[this.state.showIndex],
    });
    this.animateTimeout = setTimeout(() => {
      this[this.circle.type]();
    }, this.circle.interval);
  };

  showWinluck = () => {
    const { winners, showWinners } = this.state;
    if (showWinners.length < winners.length) {
      const newWinner = winners[showWinners.length];
      this.setState({
        showWinners: [...showWinners, newWinner],
        showData: newWinner,
      });
      this.animateTimeout = setTimeout(() => {
        this[this.circle.type]();
      }, this.circle.interval);
    } else {
      this.animateTimeout = null;
    }
  };

  makeShowlist = () => {
    const { plannedWinnerNum, showWinners } = this.state;
    const list = showWinners.map((winner, index) => (
      <div className='hoveritem' key={index}>
        <div className='itemimg'>
          <img src={winner['avatar']} />
        </div>
        <div className='itemtext'>
          {winner['name']}<br />
          {winner['number']}
        </div>
      </div>
    ));
    let i = showWinners.length;
    while (i < plannedWinnerNum) {
      i += 1;
      list.push(<div className="deafultitem" key={i} />);
    }
    return list;
  };

  render() {
    const { status, showData, circleRotate, award, plannedWinnerNum } = this.state;
    const prizerote = (status === 1 || status === 2) && (
      <div
        className='prizerote-bg'
        style={{
          transition: `transform ${this.circle.interval / 1000}s linear`,
          transform: `rotate(${circleRotate}deg)`,
        }}
      />
    );
    return award ? (
      <React.Fragment>
        <div className='prize'>
          <div className="explain">
            <div className='explainimg'>
              <img src={award['url']} />
            </div>
            <div className='explaintext'>
              <div className='machine'>
                {award['name']}
              </div>
              <div className='number'>数量:&nbsp; {plannedWinnerNum}</div>
            </div>
          </div>
          <div className='prizedraw'>
            <div className='prizedraw-container'>
              <div className='prizerote'>
                {prizerote}
                <div className='prizeavatar'>
                  <img
                    key={status === 3 ? showData.number : 'avatar'}
                    style={status === 3 && this.animateTimeout ? { animation: `spinrote 2s ease` } : null}
                    src={showData.avatar}
                  />
                </div>
              </div>
              {status === 2 && (
                <div className='arrow'>
                  <img src={arrow} /> <img src={arrow} /> <img src={arrow} />
                </div>
              )}
            </div>
            {status >= 2 && (
              <div className="prizename">
                {showData.name}<br />
                {showData.number}
              </div>
            )}
          </div>
        </div>
        <div className='namelist'>
          {this.makeShowlist()}
        </div>
      </React.Fragment>
    ) : null;
  }
}