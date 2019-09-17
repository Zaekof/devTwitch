const ft_get_token = async function () {
  const SCOPES = 'channel:read:subscriptions';
  const PARAMETERS = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials&scope=${SCOPES}`
  const URL = `https://id.twitch.tv/oauth2/token?${PARAMETERS}`;

  try {
    const response = await fetch(URL, {
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

const ft_main = async function () {
  const TOKEN = await ft_get_token();
  if (TOKEN.status) {
    console.log(TOKEN.data);
  }
}

ft_main();