# BumbleBee

**[By Pollygot](https://pollygot.com)**. Status: not production ready, use at your own risk.


A KueJS queue for common async tasks. This repo exposes an API that you can call to do some of the following:

- Facebook Bots (coming soon)
- Mailgun - send emails, (mor̨e coming soon)
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

All jobs are created by `POST`ing to the API, with the following

##### Default Options

```javascript
// POST 'localhost:3000/job'
{
  "appKey": "XXX" // required @TODO: explain
  "data": { <PAYLOAD_DATA> },
  "options" : { // not required
    "attempts": 1, // Defaults to 3 attemps
    "delay": 0, // Default will process the job immediately
    "priority": "normal" // Defaults to normal priority
  }
 }
```

##### Facebook

Post to a Facebook page feed
```javascript
// POST 'localhost:3000/facebook/feed'
{
  "appKey": "XXX" // required
  "data": {
    "feed_id": "123456789087654",
    "message": "Hello world"
  },
  "options" {} // Optional - see Default Options above
 }
```

##### Mailgun

Send a new email
```javascript
// POST 'localhost:3000/job'
{
   "data": {
     "to": "recipient@email.com",
     "from": "sender@email.com",
     "sender": "Sender Name",
     "text": "Testing some Mailgun awesomeness!"
   },
   "options" {} // Optional - see Default Options above
 }
```


### Development

Prereq's: install Redis on your dev machine.

```bash
git clone https://github.com/pollygot/bumblebee # clone this repo
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
