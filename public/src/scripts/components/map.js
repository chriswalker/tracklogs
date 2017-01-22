/* eslint-env browser */
'use strict'

var mapboxgl = require('mapbox-gl')
var Vue = require('vue')

Vue.component('map', {
  template: '#map-template',
  ready: function () {
    // TODO - get from config file, not committed to Git
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhhdGFtYXppbmd3ZWIiLCJhIjoiY2lqemd4N2xpMm9qYndka2k2NDRid2dtbCJ9.KrnZU2uyqTwae4hKCkkIjw'
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v9', // dark-v9, light-v9
      // Centre on Woking for the moment
      center: [ -0.558759, 51.315885 ],
      zoom: 14
    })
    let obj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch('https://f0uergii0e.execute-api.eu-west-1.amazonaws.com/Test/tracklogs', obj).then(response => {
      return response.json() 
    }).then(resp => {
      let json = JSON.parse(resp.body)
      map.addSource('Initial_Tracklog', {
        'type': 'geojson',
        'data': json.Items[0].geoJson
      })
      map.addLayer({
        'id': json.Items[0].tracklogDate.toString(),
        'type': 'line',
        'source': 'Initial_Tracklog',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#000',
          'line-width': 4
        }
      })
    })
  },
})
