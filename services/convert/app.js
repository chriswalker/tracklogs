'use strict'

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const docClient = new aws.DynamoDB.DocumentClient()
const toGeoJson = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser
const xpath = require('xpath')

/*
 * Responds to an S3 Put event. Retrieves the given object (which
 * should be an uploaded .gpx tracklog) and converts it into a GeoJSON
 * file. Initially just logs the first 100 bytes of the JSON, but will
 * eventually write the GeoJSON to DynamoDB.
 */
exports.conversionHandler = (event, context, callback) => {
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ''))
  const params = {
    Bucket: bucket,
    Key: key
  }  
 
  // Get the object from S3
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err)
      const message = `Error getting object ${key} from bucket ${bucket}!`
      console.log(message)
      callback(message)
    } else {
      let gpx = new DOMParser().parseFromString(data.Body.toString(), 'utf-8')
      // Extract tracklog creation time
      const metadata = extractMetadata(gpx)

      let json = toGeoJson.gpx(gpx)
      let dbData = {
        tracklogDate: metadata.tracklogDate,
        name: metadata.name,
        desc: metadata.desc,
        geoJson: json
      }
      // For moment, return first 100  chars of conversion. Will store in DynamoDB next
//      console.log('Processed GPX file; converted to ' + JSON.stringify(dbData).substring(0,100) + '...')
      // TODO: error handling as per s3 gets
      addToDynamoDB(dbData)
      callback(null, dbData)
    }
  })
}

// geoJson has no tracklog metadata, so the GPX <metadata> tag doesn't get converted.
// Extract the relevant bits of the tag here, and return as a JSON object ready
// for doc insertion into DynamoDB.
function extractMetadata(doc) {
  let metadata = {}
  
  let val = xpath.select('/gpx/metadata/time/text()', doc)
  console.log(val)
  if (val.length !== 0) {
    metadata.tracklogDate = new Date(val.toString()).getTime()
  } else {
    // Garmins put file creation time under /gpx/time
    val = xpath.select('/gpx/time/text()', doc)
    if (val.length !== 0) {
      metadata.tracklogDate = new Date(val.toString()).getTime()
    }
  }
  val = xpath.select("/gpx/metadata/name/text()", doc) 
  if (val.length !== 0) {
    metadata.name = val.toString()
  }
  val = xpath.select('/gpx/metadata/desc/text()', doc)
  if (val.length !== 0) {
    metadata.desc = val.toString()
  }
  return metadata
}

// Adds the supplied geoJSON to DynamoDB
function addToDynamoDB(dbData) {
  let params = {
    TableName: 'taw-tracklogs',
    Item: dbData
  }
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Could not save geoJson to DynamoDB - ', JSON.stringify(err, null, 2))
    } else {
      console.log('Added geoJson to DynammoDB - ', JSON.stringify(data, null, 2))
    }
  })
}
