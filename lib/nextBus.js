(function (root, factory) {
  if ( module && typeof module.exports === 'object' ) { // node.js
    var bleBean = require('ble-bean')
    var underscore = require('underscore')
    var request = require('request')
    module.exports = factory(underscore, bleBean, request)
  }
}(this, function (_, bleBean, request) { 'use-strict'

  var Bean = function(options) {
    this.opts = options || {}
    this.beanName = this.opts.name
    this.beanUUID = this.opts.uuid
    this.connectedBean = {}
    this.stopID = this.opts.stopID || '40953'
    this.interval = this.opts.interval || 60000
    this.data = []
    this.SCRATCH_1_UUD = "a495ff21c5b14b44b5121370f02d74de"
    this.SCRATCH_SERVICE = "a495ff20c5b14b44b5121370f02d74de"
    if (!this.opts.stopID) throw "stopID is required"
    this.discover(this.beanName, this.beanUUID)
  }

  _.extend(Bean.prototype, {

    discover: function(name, uuid) {
      bleBean.discover(function(bean) {
        if (bean._peripheral.advertisement.localName == name || bean._peripheral.uuid == uuid)
          this.setup(bean)
        else
          console.log("No Bean name: " + name + "or UUID: " + uuid + "was found.")
      }.bind(this))
    },

    setup: function(bean) {
      this.connectedBean = bean
      this.beanName = this.connectedBean._peripheral.advertisement.localName
      this.beanUUID = this.connectedBean._peripheral.uuid
      bean.connectAndSetup(function() {
        this.fetchData()
        this.pollData()
      }.bind(this))
    },

    fetchData: function() {
      var host = "http://svc.metrotransit.org/NexTrip/" + this.stopID + '?format=json'
      request(host, function(err, resp, body) {
        if (err) throw err
        var data = JSON.parse(body)[0]
        this.updateBean.call(this, data)
      }.bind(this))
    },

    pollData: function() {
      setInterval(this.fetchData.bind(this), this.interval)
    },

    updateBean: function(data) {
      var nextTrip = "Rt: " + data["Route"] + data["Terminal"] + " Arr: " + data["DepartureText"]
      if (nextTrip.length < 20) {
        for (var i=(20 - nextTrip.length); i > 0; i--) {
          nextTrip += " "
        }
      }
      var writeBuf = new Buffer(20)
      writeBuf.write(nextTrip)
      this.connectedBean.writeDataCharacteristic(this.SCRATCH_SERVICE, this.SCRATCH_1_UUD, writeBuf, function() {
        console.log('Bean: ' + this.beanName + '(' + this.beanUUID + ')\n scratch 1 written.\n', writeBuf.toString())
      }.bind(this))
    },

  })

  return Bean
}))
