const fetch = require('node-fetch')
const dotenv = require("dotenv");

dotenv.config();



const active_events = async () => {
    const api_url = 'https://api.brawlstars.com/v1/events/rotation'
    const jwt = process.env.JSON_WEBTOKEN

    try {
        const res = await fetch(api_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        })

        if (!res.ok) {
            throw new Error(`API request failed with ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

const battle_log = async (player_tag) => {
    const encodedTag = encodeURIComponent(player_tag.startsWith('#') ? player_tag : `#${player_tag}`);
    const api_url = `https://api.brawlstars.com/v1/players/${encodedTag}/battlelog`;
    const jwt = process.env.JSON_WEBTOKEN;

    try {
        const res = await fetch(api_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!res.ok) {
            throw new Error(`API request failed with ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        for (let i = 0; i < data.items.length; i++) {
            console.log("event: ", data.items[i].event)
            console.log("battle: ", data.items[i].battle)
        }
    } catch (err) {
        console.error(err);
    }
};

battle_log("YL2JL0P0");
