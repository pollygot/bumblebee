# Kue Workers (by Pollygot)

A KueJS implementation for common async tasks. 

Kue Workers has the following:

- Facebook Bots
- Mailgun
- Slack
- Telegram
- Twilio


## Getting started

```bash
git clone # clone this repo
npm install # install dependencies
npm run dev # start a dev server that will watch for any changes and recompile
```



### API

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

##### Mailgun 

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