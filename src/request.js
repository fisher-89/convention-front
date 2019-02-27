import axios from 'axios';
import { env, checkOauthPermission } from './util';

export default function request(url, options, onSuccess, onError) {
  const defaultOptions = { type: 'get', params: {} };
  const { type, params } = { ...defaultOptions, ...options };
  const accessToken = localStorage.getItem(`${env('TOKEN_PREFIX')}access_token`);
  if (checkOauthPermission()) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (type === 'get') {
      const paramsArray = [];
      Object.keys(params).forEach((key) => {
        let param = params[key];
        if (typeof param === 'object') {
          param = JSON.stringify(param);
        }
        paramsArray.push(`${key}=${param}`);
      });
      param = {};
      if (url.search(/\?/) === -1 && paramsArray.length > 0) {
        url += `?${paramsArray.join('&')}`;
      } else if (paramsArray.length > 0) {
        url += `&${paramsArray.join('&')}`;
      }
    }
    axios[type](url, params, { headers }).then(onSuccess).catch(onError);
  }
}
