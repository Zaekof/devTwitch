const fn_request = async function (URL, UID) {
  try {
    const response = await fetch(`${URL}?user_id=${UID}`, {
      headers: {
        'Content-Type': 'application/json',
        'Client-ID': CLIENT_ID,
        'Authorization':  'Bearer ' + CLIENT_SECRET
      },
      method: 'GET',
    });
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData.data.length !== 0) {
        return {
          status: true,
          data: jsonData.data[0]
        };
      }
      return {
        status: false,
        data: 'no on streams'
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

const fn_main = async function () {
  const URL = 'https://api.twitch.tv/helix/streams';
  const UID = USER_ID;
  const RQ_USERS = await fn_request(URL, UID);
  
  if (!RQ_USERS.status) {
    console.log(RQ_USERS.data);
  } else if (RQ_USERS.status) {
    console.log(RQ_USERS.data);
  }
}

fn_main();