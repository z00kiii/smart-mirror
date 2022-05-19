// TODO: import spotifyData
const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '1cbba7eba23147e197463f1f087e8705',
        clientSecret: '228a33b592c9437d9a19a3765ed64652'
    });

    spotifyApi.authorizationCodeGrant(code)
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            });
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400);
        });
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '1cbba7eba23147e197463f1f087e8705',
        clientSecret: '228a33b592c9437d9a19a3765ed64652',
        refreshToken: refreshToken
    });

    spotifyApi.refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            });
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400);
        });
});

app.listen(3001);