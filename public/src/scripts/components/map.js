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
  },
  methods: {
    // Gets the default location to center the map; looks in local
    // storage first, then gets the devices location (if allowed)
    // and finally falling back to a default value putting the map
    // centre over Europe
    // getLocation: function () {
    //   // If in local storage
    //   // else if we have geolocation
    //   var position
    //   if ('geolocation' in navigator) {
    //     navigator.geolocation.getCurrentPosition((pos) => {
    //       position = new mapboxgl.LngLat(pos.coords.longitude, pos.coords.latitude)
    //     })
    //   } else {
    //     // else return default
    //   }
    //
    //   return position
    // }
  }
})
