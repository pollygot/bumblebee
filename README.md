# BumbleBee

**[By Pollygot](https://pollygot.com)**. Status: not production ready, use at your own risk.

A Bull queue for common async tasks. This repo exposes an API that you can call to do some of the following:

- Facebook Bots - send to Feed
- Mailgun - send emails, (more coming soon)
- Nexmo - send messages, (more coming soon)
- Slack (coming soon)
- Telegram (coming soon)
- Trello - create cards, create lists (more coming soon)
- Twilio - (coming soon)

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
  "action": "XXX" // required @TODO: explain
  "payload": { <PAYLOAD_DATA> },
  "options" : { // not required
    "attempts": 1, // Defaults to 3 attemps
    "delay": 0, // Default will process the job immediately
    "priority": "normal" // Defaults to normal priority
  }
 }
```
