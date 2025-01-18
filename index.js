const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const dayjs = require('dayjs');
dotenv.config()
const app = express();
const PORT = 2000;
 
app.use(express.json());

const calender = google.calendar({
    version: "v3",
    auth: ""
})

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
)

const scopes = ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
const token = ""
app.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        scope: scopes,
    })

    console.log(url, "urlurlurlurl")
    res.redirect(url)
})


app.get("/google/redirect", async (req, res) => {
    const code = req.query.code
    console.log(code, "codecodecodecodecode")
    const { tokens } = await oauth2Client.getToken(code)
    console.log(tokens, "tokens")
    oauth2Client.setCredentials(tokens)
    return res.json({
        message: "you are login successfully"
    })
})



app.get('/schedule-event', async (req, res) => {
    try {
        console.log(oauth2Client.credentials.access_token, "oauth2Client.credentials.access_tokenoauth2Client.credentials.access_token")
        await calender.events.insert({
            calendarId: "primary",
            auth: oauth2Client,
            requestBody: {
                summary: 'This is Testing event',
                description: "Event is very important",
                start: {
                    dateTime: dayjs(new Date()).add(1, 'day').toISOString(),
                    timeZone: "Asia/Kolkata"
                },
                end: {
                    dateTime: dayjs(new Date()).add(1, 'day').add(1, "hour").toISOString(),
                    timeZone: "Asia/Kolkata"
                }
            }
        })
        return res.json({
            message: "Event created successfully"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
