/* eslint-env browser */
'use strict'

var Vue = require('vue')

Vue.component('navbar', {
  template: '#navbar-template',
  props: {
    user: Object
  },
  data: function () {
    return {
      authWindow: null
    }
  },
  methods: {
    openAuthWindow: function () {
      var url = 'https://www.strava.com/oauth/authorize?client_id=12775&response_type=code&redirect_uri=http://localhost:8000/exchange_token'
      this.authWindow = window.open(url, 'Authorise', 'height=670,width=485')
    },
    logout: function () {
      this.$dispatch('logout-msg', null)
    },
    getActivities: function () {
      fetch('/activities').then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  events: {
    // Handle message event from the popup when server responds to the
    // OAuth redirect. No need to check origins here, as window event handler
    // has already done that
    'authenticated': function (event) {
      this.authWindow.close()
      this.$dispatch('login-msg', event.data)
    }
  }

})
