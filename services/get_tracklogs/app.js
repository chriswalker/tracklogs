'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.getTracklogsHandler = (event, context, callback) => {
    console.log('Received, context = :', JSON.stringify(context, null, 2));
    console.log('Received, event = ', JSON.stringify(event, null, 2))
    let headers = {
        'Content-Type': 'application/json',
    }
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: headers,
    })
    
    // No need to switch on events, as this lambda is only invoked in
    // response to a GET call to the tracklogs API
    dynamo.scan({ TableName: 'taw-tracklogs' }, done)
}

