let token_session = null;
let ticks_refresh = 0;

const ft_refresh_token = async function () {
  const URL = 'https://id.twitch.tv/oauth2/token?grant_type=refresh_token';
  try {
    const response = await fetch(`${URL}&refresh_token=${REFRESH_TOKEN}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`, {
      method: 'POST',
    });
    if (response.ok) {
      const jsonData = await response.json();
      return {
        status: true,
        data: jsonData
      };
    } else {
      return {
        status: false,
        data: 'server error : ' + response.status
      };
    }
  } catch (error) {
      return {
        status: false,
        data: 'error : ' + error
      };
  }
}

/**
 * Get Subs with Twitch Api
 */
const ft_get_subscribers = async function () {
  const SCOPES = 'channel:read:subscriptions';
  const PARAMETERS = `broadcaster_id=${USER_ID}`
  const URL = `https://api.twitch.tv/helix/subscriptions?${PARAMETERS}&scope=${SCOPES}`;

  try {
    const response = await fetch(URL, {
      headers: {
        'Authorization':  'Bearer ' + token_session
      },
      method: 'GET',
    });
    if (response.ok) {
      const jsonData = await response.json();
      return {
        status: true,
        data: jsonData
      };
    } else {
      return {
        status: false,
        data: response.status
      };
    }
  } catch (error) {
    return {
      status: false,
      data: error
    };
  }
}

/**
 * Refresh Token OAuth with "expires_in" parameters get 
 * with ft_refresh_token function
 */
const fn_loop = function () {
  setTimeout(() => {
    fn_main();
  }, ticks_refresh);
}

/**
 * Main function
 * Set OAuth token and ticks_refresh and get subs
 */
const fn_main = async function () {
  if (token_session !== null) {
    const SUBS = await ft_get_subscribers();
    if (SUBS.status) {
      console.log(SUBS.data.data[0]);
    }
  } else {
    const tmp_token = await ft_refresh_token();
    if (tmp_token.status) {
      if (typeof(tmp_token.data.access_token) !== 'undefined') {
        token_session = tmp_token.data.access_token;
        if (ticks_refresh === 0) {
          fn_main();
        }
        ticks_refresh = tmp_token.data.expires_in;
        fn_loop();
      }
    }
  }
}

fn_main();