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

app.get('/events', async (req, res) => {
    let response = {
        events: null
    }
    let allEventUrls = []
    let totalPages = 1
    let i = 1
    let eventResponse;
    do {
        eventResponse = await getEvents(i)
        eventResponse = JSON.parse(eventResponse)
        totalPages = eventResponse.pagination.page_count
        let eventUrls = getUrls(eventResponse.events)
        allEventUrls.push(...eventUrls)
        i++
    }
    while (i <= totalPages)
    response.events = allEventUrls
    res.send(response)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let getEvents = async (page) => {
    let categories = [110]
    let options = {
        url: `https://www.eventbriteapi.com/v3/events/search?start_date.keyword=today&location.address=charlotte&location.within=10km&categories=${categories.join()}&page=${page}`,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        },
    };
    return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers))
            resolve(body)
        })
    })
}

let getUrls = (events) => {
    let urls = []
    events.forEach((event) => {
        urls.push(event.url)
    })
    return urls
}