const WebSocket = require('ws')
const axios = require('axios')

const Sockets = {}
Sockets.ws = {}
Sockets.heartbeat = {}

getPublicWsToken = async function(baseURL) {
  let endpoint = '/api/v1/bullet-public'
  let url = baseURL + endpoint
  let result = await axios.post(url, {})
  return result.data
}

getPrivateWsToken = async function(baseURL, sign) {
  let endpoint = '/api/v1/bullet-private'
  let url = baseURL + endpoint
  let result = await axios.post(url, {}, sign)
  return result.data
}

getSocketEndpoint = async function(type, baseURL, environment, sign) {
  let r
  if (type == 'private') {
    r = await getPrivateWsToken(baseURL, sign)
  } else { 
    r = await getPublicWsToken(baseURL)
  }
  let token = r.data.token
  if (environment === 'sandbox') {
    return `wss://push1-sandbox.kucoin.com/endpoint?token=${token}&[connectId=${Date.now()}]`
  } else if (environment === 'live') {
    return `wss://push1-v2.kucoin.com/endpoint?token=${token}&[connectId=${Date.now()}]`
  }
}

/*  
  Initiate a websocket
  params = {
    topic: enum 
    symbols: array [optional depending on topic]
  }
  eventHanlder = function
*/
Sockets.initSocket = async function(params, eventHandler) {
  try {
    let [topic, type] = Sockets.topics(params.topic, params.symbols)
    let sign = this.sign('/api/v1/bullet-private', {}, 'POST')
    let websocket = await getSocketEndpoint(type, this.baseURL, this.environment, sign)
    let ws = new WebSocket(websocket)
    Sockets.ws[topic] = ws
    ws.on('open', () => {
      console.log(topic + ' opening websocket connection... ')
      Sockets.subscribe(topic, type, eventHandler)
      Sockets.ws[topic].heartbeat = setInterval(Sockets.socketHeartBeat, 20000, topic)
    })
    ws.on('error', (error) => {
      Sockets.handleSocketError(error)
      console.log(error)
    })
    ws.on('ping', () => {
      return
    })
    ws.on('close', () => {
      clearInterval(Sockets.ws[topic].heartbeat)
      console.log(topic + ' websocket closed...')
    })
  } catch (err) {
    console.log(err)
  }
}

Sockets.handleSocketError = function(error) {
  console.log('WebSocket error: ' + (error.code ? ' (' + error.code + ')' : '') +
  (error.message ? ' ' + error.message : ''))
}

Sockets.socketHeartBeat = function(topic) {
  let ws = Sockets.ws[topic]
  ws.ping()
}

Sockets.subscribe = async function(topic, type, eventHandler) {
  let ws = Sockets.ws[topic]
  if (type === 'private') {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: topic,
      privateChannel: true,
      response: true
    }))
  } else {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: topic,
      response: true
    }))
  }
  ws.on('message', eventHandler)
}

Sockets.unsubcsribe = async function(topic, type, eventHandler) {
  let ws = Sockets.ws[topic]
  ws.send(JSON.stringify({
    id: Date.now(),
    type: 'unsubscribe',
    topic: topic,
    response: true
  }))
  ws.on('message', eventHandler)
}

Sockets.topics = function(topic, symbols = []) {
  if (topic === 'ticker') {
    return ["/market/ticker:" + symbols.join(','), 'public']
  } else if (topic === 'allTicker') {
    return ["/market/ticker:all", 'public']
  } else if (topic === 'symbolSnapshot') {
    return ["/market/snapshot:" + symbols[0], 'public']
  } else if (topic === 'marketSnapshot') {
    return ["/market/snapshot:" + symbols[0], 'public']
  } else if (topic === 'orderbook') {
    return ["/market/level2:" + symbols.join(','), 'public']
  } else if (topic === 'match') {
    return ["/market/match:" + symbols.join(','), 'public']
  } else if (topic === 'fullMatch') {
    return ["/market/level3:" + symbols.join(','), 'public']
  } else if (topic === 'orders') {
    return ["/market/level3:" + symbols.join(','), 'private']
  } else if (topic === 'balances') {
    return ["/account/balance", 'private']
  }
}

module.exports = Sockets
