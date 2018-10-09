module.exports = {
  APPS: [
    {
      type: 'FACEBOOK',
      actions: [
        {
          action: 'POST_TO_FEED',
          params: [
            { param: 'feed_id', required: true, format: 'string' },
            { param: 'message', required: true, format: 'text' },
          ]
        }
      ]
    },
    {
      type: 'MAILGUN',
      actions: [
        {
          action: 'SEND_MESSAGE',
          params: [
            { param: 'to', required: true, format: 'string' },
            { param: 'from', required: true, format: 'string' },
            { param: 'subject', required: true, format: 'string' },
            { param: 'text', required: true, format: 'text' },
          ]
        }
      ]
    },
    {
      type: 'SLACK',
      actions: [
        {
          action: 'SEND_MESSAGE',
          params: [
            { param: 'webhook', required: true, format: 'string' },
            { param: 'data', required: true, format: 'json' },
          ]
        }
      ]
    },
    {
      type: 'TRELLO',
      actions: [
        {
          action: 'CREATE_CARD',
          params: [
            { param: 'list_id', required: true, format: 'string' },
            { param: 'name', required: true, format: 'string' },
          ]
        }
      ]
    },
    // {
    //   type: 'TWILIO',
    //   actions: [
    //     {

    //     }
    //   ]
    // }
  ]
}