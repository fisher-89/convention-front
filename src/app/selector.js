import React from 'react';
import axios from 'axios';
import { Toast } from 'antd-mobile';
import './selector.less';
import copyright from '../public/copyright.png';

const selector = ['a', 'b', 'c', 'd'];

class SelectorPage extends React.Component {
  state = {
    currentUser: null,
    selected: null,
  }

  componentWillMount() {
    const currentUser = localStorage.getItem('current-user');
    if (currentUser) {
      this.state.currentUser = JSON.parse(currentUser);
    }
  }

  handleSelect = (answer) => {
    Toast.loading('提交中...', 0);
    const { currentUser } = this.state;
    axios.post('/api/submit', {
      user_id: currentUser.userid,
      name: currentUser.name,
      avatar: currentUser.avatar,
      true: answer.toUpperCase(),
    }).then((res) => {
      if ('is_ok' in res.data) {
        this.setState({ selected: answer });
        const timeLeft = Math.ceil((10000 - res.data.time) / 1000) + 1;
        const timeCost = (Math.floor(res.data.time / 100) / 10).toFixed(1);
        Toast.info(<span>用时{timeCost}秒<br />请等待答题结束</span>, timeLeft, () => {
          if (res.data.is_ok) {
            Toast.success(`回答正确，本轮得分 ${res.data.score}`, 5, () => {
              this.setState({ selected: null });
            });
          } else {
            Toast.fail(`回答错误，正确答案 ${res.data.answer}`, 5, () => {
              this.setState({ selected: null });
            });
          }
        });
      }
    }).catch((err) => {
      if (err.response && err.response.status === 400) {
        Toast.offline(err.response.data.message, 2);
      } else {
        alert(JSON.stringify(err.response));
      }
    })
  }

  render() {
    const { selected } = this.state;
    return (
      <React.Fragment>
        <div className="selector">
          {selector.map((index) => {
            return (
              <div
                key={index}
                style={selected === index ? { backgroundColor: '#ff8a3c' } : {}}
                onTouchEnd={() => {
                  this.handleSelect(index);
                }}
              >
                {index.toUpperCase()}
              </div>
            );
          })}
        </div>
        <div className="copy-right">
          <img src={copyright} />
        </div>
      </React.Fragment>
    );
  }
}

export default SelectorPage;