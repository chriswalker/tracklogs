'use strict'

var Vue = require('vue')
require('./components/map.js')
require('./components/navigation.js')
require('./components/sidebar.js')

var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      user: null
    }
  },
  methods: {
    // Handle login-msg events from the OAuth pop-up window; they will contain
    // JSON for the user who has logged in
    login: function (userJson) {
      this.user = userJson
    },
    logout: function () {
      this.user = null
    }
  }
})

// Sigh - postMessage() from the popup window sends messages to
// window listeners, not DOM ones, so cannot respond to the message
// from within the navbar component. Catch the window event and
// generate a Vue one for the navbar component, to tell it to close
// the window
function receiveMessage (event) {
  var origin = event.origin || event.originalEvent.origin
  if (origin !== 'http://localhost:8000') {
    return
  }
  vm.$broadcast('authenticated', event)
}
window.addEventListener('message', receiveMessage, false)
