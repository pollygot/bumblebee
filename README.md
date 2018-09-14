# BumbleBee by Pollygot

A KueJS queue for common async tasks. This repo exposes an API that you can call to do some of the following:

- Facebook Bots (coming soon)
- Mailgun - send emails, (more coming soon)
- Slack (coming soon)
- Telegram (coming soon)
- Trello - create cards, (more coming soon)
- Twilio (coming soon)

### Why use this?

For many of the same benefits that any queue will give you:
- offloading long-running tasks
- centralised logging
- retry abilities
- delaying tasks (eg, sending follow-up emails after 10 mins)
- It can help to keep your core projects thinner since this repo will contain all the heavy third-party libraries.


## Getting started

### Usage

It's recommended that you fork this repo so that you can pull updates at any time.

```bash
# If you downloaded or cloned, you should create an upstream branch with the original repo
git remote add upstream https://github.com/pollygot/workers-kue

# Keep updated at any time
git fetch upstream # fetch changes from Pollygot
git checkout master # switch to your local master branch
git merge upstream/master # update local master with changes from Pollygot

# Set up your own config for each app
cp config/sample.json5 config/default.json5 # <-- Fill this with your own config
npm run dev # start a dev server that will watch for any changes and recompile
```

### Running with Docker

```bash
docker-compose up
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

#### Facebook

Post to a Facebook page feed
```javascript
// POST 'localhost:3000/job'
{
   "type": "FACEBOOK_POST_TO_PAGE_FEED",
   "data": {
     "feed_id": "123456789087654",
     "message": "Hello world",
     "access_token": "XXXXXXXXXXXXXXXXXXXX"
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


#### Slack

Create a new card
```javascript
// POST 'localhost:3000/job'
{
   "type": "SLACK_POST_MESSAGE",
   "data": {
     "webhook": "XXXX", // Webhook for your channel
     "payload": {} // Slack message payload - see https://api.slack.com/docs/messages/builder
   }
 }
```


### Development

```bash
git clone https://github.com/pollygot/workers-kue # clone this repo
npm install # install dependencies
cp config/sample.json5 config/default.json5 # <-- Fill this with you own config
npm run dev # start a dev server that will watch for any changes and recompile

```

# Roadmap

- [ ] Add CORs to the API
- [ ] Simplify the API for each worker - eg: `/trello`, `/slack` rather than all going to `/job`
- [ ] Deployment strategies
- [ ] Make each worker "multitenant" - eg, allow multiple Facebook Bots
- [ ] Failure notifications? Perhaps using Mailgun/trello etc
- [ ] Multiple implementations - not just Kue. Users should be able to choose Kue, Bull, Rabbit etc, and they all function with the same API
