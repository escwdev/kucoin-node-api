const axios = require('axios')

const Market = {}

/* 
  Get Symbols List
  GET /api/v1/symbols
  market = string [optional]
*/
Market.getSymbols = async function(market = "") {
  let endpoint = ""
  if (market != "") {
    endpoint = `/api/v1/symbols?market=${market}`
  } else {
    endpoint = "/api/v1/symbols"
  }
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/*  
  Get Ticker
  GET /api/v1/market/orderbook/level1?symbol=<symbol>
  symbol = string
*/
Market.getTicker = async function(symbol) {
  let endpoint = `/api/v1/market/orderbook/level1?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get All Tickers
  GET /api/v1/market/allTickers
*/
Market.getAllTickers = async function() {
  let endpoint = '/api/v1/market/allTickers'
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get 24hr Stats
  GET /api/v1/market/stats?symbol=<symbol>
  symbol = string
*/
Market.get24hrStats = async function(symbol) {
  let endpoint = `/api/v1/market/stats?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Market List
  GET /api/v1/markets
*/
Market.getMarketList = async function() {
  let endpoint = '/api/v1/markets'
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Part Order Book (aggregated) 
  GET /api/v1/market/orderbook/level2_20?symbol=<symbol>
  GET /api/v1/market/orderbook/level2_100?symbol=<symbol>
  params = {
    amount: integer (20 || 100) 
    symbol: string
  }
*/
Market.getPartOrderBook = async function(params) {
  let endpoint = `/api/v1/market/orderbook/level2_${params.amount}?symbol=${params.symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Full Order Book (aggregated)
  GET /api/v1/market/orderbook/level2?symbol=<symbol>
  symbol = string
*/
Market.getOrderBook = async function(symbol) {
  let endpoint = `/api/v1/market/orderbook/level2?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Full Order Book (aggregated)
  GET /api/v2/market/orderbook/level2?symbol=<symbol> 
  symbol = string
*/
Market.getFullOrderBook = async function(symbol) {
  let endpoint = `/api/v3/market/orderbook/level2?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Full Order Book (atomic) 
  GET /api/v1/market/orderbook/level3?symbol=<symbol>
  symbol = string
*/
Market.getFullOrderBookAtomic = async function(symbol) {
  let endpoint = `/api/v3/market/orderbook/level3?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Trade Histories
  GET /api/v1/market/histories?symbol=<symbol>
  symbol = string
*/
Market.getTradeHistories = async function(symbol) {
  let endpoint = `/api/v1/market/histories?symbol=${symbol}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Klines
  GET /api/v1/market/candles?symbol=<symbol>
  params = {
    symbol: string
    startAt: long (unix time)
    endAt: long (unix time)
    type: enum [1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 8hour, 12hour 1day, 1week]
  }
*/
Market.getKlines = async function(params) {
  let endpoint = '/api/v1/market/candles'
  params.startAt = params.startAt.toString().slice(0, 10)
  params.endAt = params.endAt.toString().slice(0, 10)
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url)
  return result.data
}

/* 
  Get currencies
  GET /api/v1/currencies
*/
Market.getCurrencies = async function() {
  let endpoint = '/api/v1/currencies'
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get currency detail
  GET /api/v1/currencies/{currency}
  currency = string
*/
Market.getCurrency = async function(currency) {
  let endpoint = `/api/v1/currencies/${currency}`
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

/* 
  Get Fiat Price
  GET /api/v1/prices
  params = {
    base: string (e.g. 'USD') [optional]
    currencies: array
  }
*/
Market.getFiatPrice = async function(params) {
  let endpoint = '/api/v1/prices'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url)
  return result.data
}

/* 
  Server Time
  GET /api/v1/timestamp
*/
Market.getServerTime = async function() {
  let endpoint = '/api/v1/timestamp'
  let url = this.baseURL + endpoint
  let result = await axios.get(url)
  return result.data
}

module.exports = Market