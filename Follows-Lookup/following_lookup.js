// Fetch the users being followed by a specific account, by ID
// https://developer.twitter.com/en/docs/twitter-api/users/follows/quick-start

const needle = require('needle');

// this is the ID for @TwitterDev
const userId = 470067758;
const url = `https://api.twitter.com/2/users/${userId}/following`;
const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAHXokwEAAAAAeD1kSztveLCpFORLmWks62l1HoU%3Dm2Ufm8cdDftM8Ez065zPrkZ0obyGdJoBtwraNUjxfQ0AUjVaOG';

const getFollowing = async () => {
    let users = [];
    let params = {
        "max_results": 100,
        "user.fields": "created_at"
    }

    const options = {
        headers: {
            "User-Agent": "v2FollowingJS",
            "Authorization": `Bearer ${bearerToken}`
        }
    }

    let hasNextPage = true;
    let nextToken = null;
    console.log("Retrieving users this user is following...");
    while (hasNextPage) {
        let resp = await getPage(params, options, nextToken);
        if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
            if (resp.data) {
                users.push.apply(users, resp.data);
            }
            if (resp.meta.next_token) {
                nextToken = resp.meta.next_token;
            } else {
                hasNextPage = false;
            }
        } else {
            hasNextPage = false;
        }
    }

    console.log(users);
    i=0;
    while(i<users.length){
        console.log(users[i]);
        i++;
    }
    console.log(`Got ${users.length} users.`);

}

const getPage = async (params, options, nextToken) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }

    try {
        const resp = await needle('get', url, params, options);

        if (resp.statusCode != 200) {
            console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
            return;
        }
        return resp.body;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
}

getFollowing();
