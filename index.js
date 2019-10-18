const express = require('express')
const request = require('request')
const fs = require('fs')
const app = express()
const port = 3000

let token
fs.readFile('./charlotte-events/private-token', 'utf8', (err, data) => {
    if (err) throw err;
    token = data
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/events', (req, res) => {
    let options = {
        url: 'https://www.eventbriteapi.com/v3/events/search?start_date.keyword=today&location.address=charlotte&location.within=10km',
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    let eventResponse;
    request(options, function(error, response, body) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        eventResponse = body
        res.send(eventResponse)
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))