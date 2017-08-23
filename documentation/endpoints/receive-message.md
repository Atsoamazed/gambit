# Receive Message

```
POST /api/v1/receive-message
```

Receives a message and sends a reply (or forwards it, when appropriate).


## Input

Name | Type | Description
--- | --- | ---
`From` | `string` | Sender's phone number (included when we receive a Twilio message)
`Body` | `string` | Incoming message (included when we receive a Twilio message)
`slackId` | `string` |
`slackChannel` | `string` |
`facebookId` | `string` |
`userId` | `string` | Northstar ID
`text` | `string` | Incoming message sent from User.
`mediaUrl` | `string` | Media attachment URL (currently only supports 1 attachment).

## Examples

### Request

Example of an inbound Twilio request.
> The user's conversation state is currently expecting a reportback picture

```
{
  "ToCountry": "US",
  "MediaContentType0": "image/png",
  "ToState": "",
  "SmsMessageSid": "MM09a8f657567f807443191c1e7exxxxxx",
  "NumMedia": "1",
  "ToCity": "",
  "FromZip": "10010",
  "SmsSid": "MM09a8f657567f807443191c1e7exxxxxx",
  "FromState": "NY",
  "SmsStatus": "received",
  "FromCity": "NEW YORK",
  "Body": "",
  "FromCountry": "US",
  "To": "38383",
  "ToZip": "",
  "NumSegments": "1",
  "MessageSid": "MM09a8f657567f807443191c1e7exxxxxx",
  "From": "+5555555555",
  "MediaUrl0": "http://bit.ly/2wkfrep",
  "ApiVersion": "2010-04-01"
}
```

### Created message

```
{
  "_id": ObjectId("5995cf29e4bca305f02e50b3"),
  "updatedAt": ISODate("2017-08-17T17:15:21.865Z"),
  "createdAt": ISODate("2017-08-17T17:15:21.865Z"),
  "userId": "+5555555555",
  "campaignId": 819,
  "topic": "campaign",
  "conversation": ObjectId("5994caf4a92890fa8a52de72"),
  "text": "",
  "direction": "inbound",
  "attachments": [
    {
      "contentType": "image/jpeg",
      "url": "http://placekitten.com/g/800/800"
    }
  ],
  "__v": 0
}
```

### Response

```
{
  "reply": {
    "__v": 0,
    "updatedAt": "2017-08-17T17:15:22.466Z",
    "createdAt": "2017-08-17T17:15:22.466Z",
    "userId": "+5555555555",
    "campaignId": 819,
    "topic": "campaign",
    "conversation": "5994caf4a92890fa8a52de72",
    "text": "Got it! Now text back a caption for your photo (think Instagram)! Keep it short & sweet, under 60 characters please.",
    "template": "gambit",
    "direction": "outbound-reply",
    "_id": "5995cf2ae4bca305f02e50b4",
    "attachments": []
  }
}
```

### Request

```
curl -X "POST" "http://localhost:5100/api/v1/retrieve-message" \
     -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
     --data-urlencode "userId=123" \
     --data-urlencode "text=I can haz thumb socks?" \
```

### Response

Returns an Outbound Reply Message (when Conversation is not paused).

```
{
  "reply": {
    "__v": 0,
    "updatedAt": "2017-08-17T17:15:22.466Z",
    "createdAt": "2017-08-17T17:15:22.466Z",
    "userId": "U1BBD0D4G",
    "topic": "random",
    "conversation": "5977aed9bb17210a72aad245",
    "text": "Sorry, I'm not sure how to respond to that.\n\nSay MENU to find a Campaign to join.",
    "template": "noCampaignMessage",
    "direction": "outbound-reply",
    "_id": "59776272230c54001125ef7c",
    "attachments": []
  }
}
```
