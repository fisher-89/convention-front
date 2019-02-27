import Env from '../.env.json';

const tokenPrefix = env('TOKEN_PREFIX');

export function checkOauthPermission() {
  if (localStorage.getItem(`${tokenPrefix}access_token`)
    && localStorage.getItem(`${tokenPrefix}access_token_expires_in`) > new Date().getTime()) {
    return true;
  } else if (localStorage.getItem(`${tokenPrefix}refresh_token`)) {
    refreshAccessToken();
  } else {
    console.log('redirect');
    redirectToOaAuthorize();
  }
}

export function env(key, defaultValue = '') {
  return Env[key] || defaultValue;
}

function refreshAccessToken() {
  async function test() {
    const params = {
      grant_type: 'refresh_token',
      refresh_token: localStorage.getItem(`${tokenPrefix}refresh_token`),
      client_id: env('OA_CLIENT_ID'),
      client_secret: env('OA_CLIENT_SECRET'),
      scope: '',
    };
    const response = await axios.post('/oauth/token', params).then((res) => {
      localStorage.setItem(`${tokenPrefix}access_token`, res.data.access_token);
      localStorage.setItem(`${tokenPrefix}access_token_expires_in`, new Date().getTime() + ((res.data.expires_in - 10) * 1000));
      localStorage.setItem(`${tokenPrefix}refresh_token`, res.data.refresh_token);
      return true;
    }).catch(redirectToOaAuthorize);
    return response;
  }
}

function redirectToOaAuthorize() {
  localStorage.setItem(`${tokenPrefix}access_path`, window.location.href);
  window.location.href = `${env('OA_PATH')}/oauth/authorize?client_id=${env('OA_CLIENT_ID')}&response_type=code`;
}