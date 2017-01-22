'use strict'

const Vue = require('vue')

require('./components/map.js')
require('./components/navigation.js')
require('./components/sidebar.js')
require('./components/logindialog.js')

// TODO refactoring some of this
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

