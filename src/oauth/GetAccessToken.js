import React, { Component } from 'react';
import axios from 'axios';
import { env } from '../util';

export default class GetAccessToken extends Component {
  componentWillMount() {
    const { location: { pathName, search } } = this.props;
    const authCode = search.match(/code=(\w+)$/)[1];
    const params = {
      grant_type: 'authorization_code',
      client_id: env('OA_CLIENT_ID'),
      client_secret: env('OA_CLIENT_SECRET'),
      redirect_uri: pathName,
      code: authCode,
    };
    const tokenPrefix = env('TOKEN_PREFIX');
    axios.post('/oauth/token', params).then((res) => {
      localStorage.setItem(`${tokenPrefix}access_token`, res.data.access_token);
      localStorage.setItem(`${tokenPrefix}access_token_expires_in`, new Date().getTime() + ((res.data.expires_in - 10) * 1000));
      localStorage.setItem(`${tokenPrefix}refresh_token`, res.data.refresh_token);
      const accessPath = localStorage.getItem(`${tokenPrefix}access_path`);
      localStorage.removeItem(`${tokenPrefix}access_path`);
      window.location.href = accessPath;
    }).catch((err) => {
      console.log('err', err);
    })
  }

  render() {
    return (
      <div>登录中...</div>
    );
  }
}
