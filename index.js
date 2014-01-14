#! /usr/bin/env node

var https       = require('https')
var http        = require('http')
var fs          = require('fs')
var join        = require('path').join
var btcprogress = require('btcprogress')
var route       = require('tiny-route')
var path        = require('path')
var ecstatic    = require('ecstatic')
var stack       = require('stack')
var redirect    = require('./lib/https-redirect')
var config      = require('./config')

var bar         = btcprogress()

var app = stack(
  route('/badge/', bar),
  ecstatic(path.join(__dirname, 'static'))
)

console.log(config)

var secure = process.getuid() === 0

if(secure) {
  https.createServer({
   cert: fs.readFileSync(config.cert),
   key : fs.readFileSync(config.key)
  }, app).listen(443)

  http.createServer(redirect()).listen(80)

} else {
  http.createServer(app).listen(config.port)
}
