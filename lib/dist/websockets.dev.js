"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var WebSocket = require('ws');

var axios = require('axios');

var Sockets = {};
Sockets.ws = {};
Sockets.heartbeat = {};

getPublicWsToken = function getPublicWsToken(baseURL) {
  var endpoint, url, result;
  return regeneratorRuntime.async(function getPublicWsToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          endpoint = '/api/v1/bullet-public';
          url = baseURL + endpoint;
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.post(url, {}));

        case 4:
          result = _context.sent;
          return _context.abrupt("return", result.data);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

getPrivateWsToken = function getPrivateWsToken(baseURL, sign) {
  var endpoint, url, result;
  return regeneratorRuntime.async(function getPrivateWsToken$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          endpoint = '/api/v1/bullet-private';
          url = baseURL + endpoint;
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.post(url, {}, sign));

        case 4:
          result = _context2.sent;
          return _context2.abrupt("return", result.data);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

getSocketEndpoint = function getSocketEndpoint(type, baseURL, environment, sign) {
  var r, token, instanceServer;
  return regeneratorRuntime.async(function getSocketEndpoint$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(type == 'private')) {
            _context3.next = 6;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(getPrivateWsToken(baseURL, sign));

        case 3:
          r = _context3.sent;
          _context3.next = 9;
          break;

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(getPublicWsToken(baseURL));

        case 8:
          r = _context3.sent;

        case 9:
          token = r.data.token;
          instanceServer = r.data.instanceServers[0];

          if (!instanceServer) {
            _context3.next = 20;
            break;
          }

          if (!(environment === 'sandbox')) {
            _context3.next = 16;
            break;
          }

          return _context3.abrupt("return", "".concat(instanceServer.endpoint, "?token=").concat(token, "&[connectId=").concat(Date.now(), "]"));

        case 16:
          if (!(environment === 'live')) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", "".concat(instanceServer.endpoint, "?token=").concat(token, "&[connectId=").concat(Date.now(), "]"));

        case 18:
          _context3.next = 21;
          break;

        case 20:
          throw Error("No Kucoin WS servers running");

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  });
};
/*  
  Initiate a websocket
  params = {
    topic: enum 
    symbols: array [optional depending on topic]
  }
  eventHanlder = function
*/


Sockets.initSocket = function _callee(params, eventHandler) {
  var _Sockets$topics, _Sockets$topics2, topic, endpoint, type, sign, websocket, ws;

  return regeneratorRuntime.async(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          if (!params.sign) params.sign = false;
          if (!params.endpoint) params.endpoint = false;
          _Sockets$topics = Sockets.topics(params.topic, params.symbols, params.type, params.endpoint, params.sign), _Sockets$topics2 = _slicedToArray(_Sockets$topics, 3), topic = _Sockets$topics2[0], endpoint = _Sockets$topics2[1], type = _Sockets$topics2[2];
          sign = this.sign('/api/v1/bullet-private', {}, 'POST');
          _context4.next = 7;
          return regeneratorRuntime.awrap(getSocketEndpoint(type, this.baseURL, this.environment, sign));

        case 7:
          websocket = _context4.sent;
          ws = new WebSocket(websocket);
          Sockets.ws[topic] = ws;
          ws.on('open', function () {
            console.log(topic + ' opening websocket connection... ');
            Sockets.subscribe(topic, endpoint, type, eventHandler);
            Sockets.ws[topic].heartbeat = setInterval(Sockets.socketHeartBeat, 20000, topic);
          });
          ws.on('error', function (error) {
            Sockets.handleSocketError(error);
            console.log(error);
          });
          ws.on('ping', function () {
            return;
          });
          ws.on('close', function () {
            clearInterval(Sockets.ws[topic].heartbeat);
            console.log(topic + ' websocket closed...');
          });
          _context4.next = 19;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, this, [[0, 16]]);
};

Sockets.handleSocketError = function (error) {
  console.log('WebSocket error: ' + (error.code ? ' (' + error.code + ')' : '') + (error.message ? ' ' + error.message : ''));
};

Sockets.socketHeartBeat = function (topic) {
  var ws = Sockets.ws[topic];
  ws.ping();
};

Sockets.subscribe = function _callee2(topic, endpoint, type, eventHandler) {
  var ws;
  return regeneratorRuntime.async(function _callee2$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          ws = Sockets.ws[topic];

          if (type === 'private') {
            ws.send(JSON.stringify({
              id: Date.now(),
              type: 'subscribe',
              topic: endpoint,
              privateChannel: true,
              response: true
            }));
          } else {
            ws.send(JSON.stringify({
              id: Date.now(),
              type: 'subscribe',
              topic: endpoint,
              response: true
            }));
          }

          ws.on('message', eventHandler);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

Sockets.unsubscribe = function _callee3(topic, endpoint, type, eventHandler) {
  var ws;
  return regeneratorRuntime.async(function _callee3$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          ws = Sockets.ws[topic];
          ws.send(JSON.stringify({
            id: Date.now(),
            type: 'unsubscribe',
            topic: endpoint,
            response: true
          }));
          ws.on('message', eventHandler);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

Sockets.topics = function (topic) {
  var symbols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var type = arguments.length > 2 ? arguments[2] : undefined;
  var endpoint = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var sign = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (endpoint) return [topic, endpoint + (symbols.length > 0 ? ':' : '') + symbols.join(','), sign ? 'private' : 'public'];

  if (topic === 'ticker') {
    return [topic, "/market/ticker:" + symbols.join(','), 'public'];
  } else if (topic === 'allTicker') {
    return [topic, "/market/ticker:all", 'public'];
  } else if (topic === 'symbolSnapshot') {
    return [topic, "/market/snapshot:" + symbols[0], 'public'];
  } else if (topic === 'marketSnapshot') {
    return [topic, "/market/snapshot:" + symbols[0], 'public'];
  } else if (topic === 'orderbook') {
    return [topic, "/market/level2:" + symbols.join(','), 'public'];
  } else if (topic === 'match') {
    return [topic, "/market/match:" + symbols.join(','), 'public'];
  } else if (topic === 'fullMatch') {
    return [topic, "/spotMarket/level3:" + symbols.join(','), 'public'];
  } else if (topic === 'orders') {
    return [topic, "/spotMarket/tradeOrders" + symbols.join(','), 'private'];
  } else if (topic === 'balances') {
    return [topic, "/account/balance", 'private'];
  } else if (topic === 'depth50') {
    return [topic, "/spotMarket/level2Depth50:" + symbols.join(','), 'public'];
  } else if (topic === 'depth5') {
    return [topic, "/spotMarket/level2Depth5:" + symbols.join(','), 'public'];
  } else if (topic === 'klines') {
    return [topic, "/market/candles:" + symbols.join(',') + '_' + type, 'public'];
  }
};

module.exports = Sockets;