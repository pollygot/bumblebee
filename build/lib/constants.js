'use strict'

module.exports = {
  APPS: [
    {
      type: 'FACEBOOK',
      actions: [
        {
          action: 'POST_TO_FEED',
          params: [
            {
              param: 'feed_id',
              required: true,
              format: 'string',
              label: 'Feed ID',
              help: 'Enter the User ID, Page ID, Event ID, or Group ID',
            },
            {
              param: 'message',
              required: true,
              format: 'text',
              label: 'Message',
            },
          ],
        },
      ],
    },
    {
      type: 'MAILGUN',
      actions: [
        {
          action: 'SEND_MESSAGE',
          params: [
            { param: 'to', required: true, format: 'string', label: 'To' },
            { param: 'from', required: true, format: 'string', label: 'From' },
            {
              param: 'subject',
              required: true,
              format: 'string',
              label: 'Subject',
            },
            { param: 'text', required: true, format: 'text', label: 'Body' },
          ],
        },
      ],
    },
    {
      type: 'NEXMO',
      actions: [
        {
          action: 'SEND_MESSAGE',
          params: [
            {
              param: 'to',
              required: true,
              format: 'string',
              label: 'To',
              help: 'eg: +1234567890',
            },
            {
              param: 'from',
              required: true,
              format: 'string',
              label: 'From',
              help: 'eg: Acme Inc',
            },
            {
              param: 'text',
              required: true,
              format: 'text',
              label: 'Text Message',
            },
          ],
        },
      ],
    },
    {
      type: 'SLACK',
      actions: [
        {
          action: 'SEND_MESSAGE',
          params: [
            {
              param: 'webhook',
              required: true,
              format: 'string',
              label: 'Webhook',
            },
            { param: 'data', required: true, format: 'json', label: 'Payload' },
          ],
        },
      ],
    },
    {
      type: 'TRELLO',
      actions: [
        {
          action: 'CREATE_CARD',
          params: [
            {
              param: 'list_id',
              required: true,
              format: 'string',
              label: 'List ID',
            },
            {
              param: 'name',
              required: true,
              format: 'string',
              label: 'Card Name',
            },
          ],
        },
        {
          action: 'CREATE_LIST',
          params: [
            {
              param: 'board_id',
              required: true,
              format: 'string',
              label: 'Board ID',
            },
            {
              param: 'name',
              required: true,
              format: 'string',
              label: 'List Name',
            },
          ],
        },
      ],
    },
  ],
}
