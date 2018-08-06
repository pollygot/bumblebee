# Kue Workers

A KueJS queue for common async tasks. This repo exposes an API that you can call to do some of the following:

- Facebook Bots (coming soon)
- Mailgun - send emails, (more coming soon)
- Slack (coming soon)
- Telegram (coming soon)
- Trello - create cards, (more coming soon)
- Twilio (coming soon)

### Why use this?

For many of the same benefits that any queue will give you: offloading long-running tasks, centralised logging, retry abilities etc. Also it will help to keep your core projects thinner since this repo will contain all the heavy third-party libraries.


## Getting started

### Running with Docker

```bash
git clone https://github.com/pollygot/workers-kue # clone this repo
cp config/sample.json5 config/default.json5 # <-- Fill this with you own config
docker-compose up
```

### Development

```bash
git clone https://github.com/pollygot/workers-kue # clone this repo
npm install # install dependencies
cp config/sample.json5 config/default.json5 # <-- Fill this with you own config
npm run dev # start a dev server that will watch for any changes and recompile
```



## API

All jobs are created by `POST`ing to the `/job` endpoint

```javascript
// POST 'localhost:3000/job'
{
   "type": "<MODULE_AND_METHOD_NAME>",
   "data": { <PAYLOAD_DATA> },
   "options" : { // not required 
     "attempts": 1, // Defaults to 3 attemps
     "delay": 0, // Default will process the job immediately
     "priority": "normal" // Defaults to normal priority
   }
 }
```

#### Mailgun 

Send a new email
```javascript
// POST 'localhost:3000/job'
{
   "type": "MAILGUN_SEND_MESSAGE",
   "data": {
     "to": "recipient@email.com",
     "from": "sender@email.com",
     "sender": "Sender Name",
     "text": "Testing some Mailgun awesomeness!"
   }
 }
```

#### Trello 

Create a new card
```javascript
// POST 'localhost:3000/job'
{
   "type": "TRELLO_CREATE_CARD",
   "data": {
     "list_id": "XXXX", // Trello List ID
     "name": "Card name",
     "desc": "Card description"
   }
 }
```