import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import Avatar from 'components/Avatar';
import './welcome.less';
import signIn from '../public/sign_in.png';
import copyright from '../public/copyright.png';

class WelcomePage extends React.Component {
  state = {
    hasLoggedIn: false,
    currentUser: null,
    showSelector: false,
  }

  componentWillMount() {
    const currentUser = localStorage.getItem('current-user');
    if (currentUser) {
      this.setState({
        hasLoggedIn: true,
        currentUser: JSON.parse(currentUser),
      });
    }
  }

  login = () => {
    Toast.loading('签到中...', 0);
    dd.ready(() => {
      dd.runtime.permission.requestAuthCode({
        corpId: DINGTALK_CORP_ID,
        onSuccess: (result) => {
          const { code } = result;
          axios.get(`/api/get-user?code=${code}`)
            .then((res) => {
              localStorage.setItem('current-user', JSON.stringify(res.data));
              this.setState({
                hasLoggedIn: true,
                currentUser: res.data,
              }, () => {
                Toast.hide();
              })
            })
            .catch((err) => {
              if (err.response && err.response.status === 400) {
                Toast.offline(err.response.data.message, 2);
              } else {
                alert(JSON.stringify(err.response));
              }
            });
        },
        onFail: (err) => {
          alert(JSON.stringify(err));
        }
      })
    });
  }

  render() {
    const { hasLoggedIn, currentUser } = this.state;
    return (
      <div id="welcome">
        {hasLoggedIn ? (
          <React.Fragment>
            <div className="id-card">
              <Avatar width="84px" src={currentUser.avatar} />
              {currentUser.name}<br />[已签到]
            </div>
            <div className="sign-in-row">
              <p><Link to="/selector"><span style={{ color: '#00E2FF' }}>开始答题</span></Link></p>
            </div>
          </React.Fragment>
        ) : (
          <div className="sign-in-row">
            <img className="sign-in-button" src={signIn} onTouchEnd={this.login} />
          </div>
        )}
        <div className="copy-right">
          <img src={copyright} />
        </div>
      </div>
    );
  }
}

export default WelcomePage;