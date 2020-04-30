const axios = require('axios')

const Trade = {}

/* 
  Place a new order
  POST /api/v1/orders
  Details for market order vs. limit order and params see https://docs.kucoin.com/#place-a-new-order
  General params
  params = {
    clientOid: string
    side: string ['buy' || 'sell]
    symbol: string
    type: string [optional, default: limit]
    remark: string [optional]
    stop: string [optional] - either loss or entry and needs stopPrice
    stopPrice: string [optional] - needed for stop 
    stp: string [optional] (self trade prevention)
    price: string,
    size: string,
    timeInForce: string [optional, default is GTC]
    cancelAfter: long (unix time) [optional]
    hidden: boolean [optional]
    Iceberg: boolean [optional]
    visibleSize: string [optional]
  }
*/
Trade.placeOrder = async function(params) {
  let endpoint = '/api/v1/orders'
  let url = this.baseURL + endpoint
  let result = await axios.post(url, params, this.sign(endpoint, params,'POST'))
  return result.data
}

/* 
  Cancel an order
  DELETE /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
Trade.cancelOrder = async function(params) {
  let endpoint = '/api/v1/orders/' + params.id 
  delete params.id
  let url = this.baseURL + endpoint
  let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

/* 
  Cancel all orders
  DELETE /api/v1/orders
  params = {
    symbol: string [optional]
  }
*/
Trade.cancelAllOrders = async function(params) {
  let endpoint = '/api/v1/orders'
  let url = this.baseURL + endpoint
  let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

/* 
  List orders
  GET /api/v1/orders
  params = {
    status: string [optional, default: dealt, alt: active]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional, limit || limit_stop || market_stop]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
Trade.getOrders = async function(params = {}) {
  let endpoint = '/api/v1/orders' 
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get an order
  GET /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
Trade.getOrderById = async function(params) {
  let endpoint = '/api/v1/orders/' + params.id
  delete params.id
  let url = this.baseURL + endpoint
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  List Fills
  GET /api/v1/fills
  params: {
    orderId: string [optional]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
Trade.listFills = async function(params = {}) {
  let endpoint = '/api/v1/fills'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  List Your Recent Fills: max 1000 fills in the last 24 hours, all symbols
  GET /api/v1/limit/fills
*/
Trade.recentFills = async function( params = {} ) {
  let endpoint = '/api/v1/limit/fills'
  let url = this.baseURL + endpoint + this.formatQuery( params )
  let result = await axios.get( url, this.sign( endpoint, params, 'GET' ) )
  return result.data
}

/* 
  Get V1 Historical Orders List
  GET /api/v1/hist-orders
  params: {
    currentPage: integer [optional]
    pageSize: integer [optional]
    symbol: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    side: string (buy || sell) [optional]
  }
*/
Trade.getV1HistoricalOrders = async function(params = {}) {
  let endpoint = '/api/v1/hist-orders'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

module.exports = Trade
