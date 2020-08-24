# kucoin-node-api

This is an open source project created to utilize the Kucoin v2 API to support automated, algorithmic trading. The project was made and tested for Node 8.0+. 

There are no guarentees towards the stability or effectiveness of this project. Comments, 
contributions, stars and donations are, however, all welcome.

## Installation

`npm install kucoin-node-api`

Alternatively, you can clone/download the repository and import into your project by file path.

## Getting Started

To begin using the API wrapper, require it, create a config object that contains your API key, Secret key and Passphrase provided by Kucoin. Then run the custom init() function with your config object as a parameter. If you are only using Public endpoints, the config object only requires the environment key/value pair. 

Example code is as follows:

```javascript 
const api = require('kucoin-node-api')

const config = {
  apiKey: 'xXXXXXXXXXXXXXXXXXXXXxxxxxxxxxxxxxxxxxxxxxXXX',
  secretKey: 'xxxxxxxxXXXXXXXXXXXXXxxXXXXXXXXXXXXXxxxXXX',
  passphrase: 'xxxxxx',
  environment: 'live'
}

api.init(config)
```

## Using the API Wrapper

Once the API wrapper object is created, you can call any of the associated functions. They will return a Promise which can be utlized with .then/.catch or async/await. Note that the Promise based approach will return directly whereas the async/await approach requires calling the function.

Simple example:

```javascript
// Promise based approach for getting account information (private & signed)
api.getAccounts().then((r) => {
  console.log(r.data)
}).catch((e) => {
  console.log(e))
})

// Async/Await get account info example (private & signed)
async function getAccounts() {
  try {
    let r = await api.getAccounts()
    console.log(r.data)
  } catch(err) {
    console.log(err)
  } 
}
```

This approach allows for more complex multi-call asynchronous functionality, especially useful for automated trading.

## Market Endpoint (Public)

Public endpoints do not require an API Key, Secret Key or API Passphrase. 

```javascript
/* 
  Get Symbols List
  GET /api/v1/symbols
  market = string [optional]
*/
api.getSymbols(market)
```

```javascript
/*  
  Get Ticker
  GET /api/v1/market/orderbook/level1?symbol=<symbol>
  symbol = string
*/
api.getTicker(symbol)
```

```javascript
/* 
  Get All Tickers
  GET /api/v1/market/allTickers
*/
api.getAllTickers()
```

```javascript
/* 
  Get 24hr Stats
  GET /api/v1/market/stats?symbol=<symbol>
  symbol = string
*/
api.get24hrStats(symbol)
```

```javascript
/* 
  Get Market List
  GET /api/v1/markets
*/
api.getMarketList(symbol)
```


```javascript
/* 
  Get Part Order Book (aggregated) 
  GET /api/v1/market/orderbook/level2_20?symbol=<symbol>
  GET /api/v1/market/orderbook/level2_100?symbol=<symbol>
  params = {
    amount: integer (20 || 100) 
    symbol: string
  }
*/
api.getPartOrderBook(params)
```

```javascript
/* 
  Get Full Order Book (aggregated)
  GET /api/v2/market/orderbook/level2?symbol=<symbol> 
  symbol = string
*/
api.getFullOrderBook(symbol)
```

```javascript
/* 
  Get Full Order Book (atomic) 
  GET /api/v1/market/orderbook/level3?symbol=<symbol>
  symbol = string
*/
api.getFullOrderBookAtomic(symbol)
```

```javascript
/* 
  Get Trade Histories
  GET /api/v1/market/histories?symbol=<symbol>
  symbol = string
*/
api.getTradeHistories(symbol)
```

```javascript
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
api.getKlines(params)
```

```javascript
/* 
  Get currencies
  GET /api/v1/currencies
*/
api.getCurrencies()
```

```javascript
/* 
  Get currency detail
  GET /api/v1/currencies/{currency}
  currency = string
*/
api.getCurrency(currency)
```

```javascript
/* 
  Get Fiat Price
  GET /api/v1/prices
  params = {
    base: string (e.g. 'USD') [optional]
    currencies: array
  }
*/
api.getFiatPrices(params)
```

```javascript
/* 
  Server Time
  GET /api/v1/timestamp
*/
api.getServerTime()
```

## User Endpoints (Private)

```javascript
/* 
  List Accounts
  GET /api/v1/accounts
  params = {
    currency: string [optional]
    type: string [optional]
  }
*/
api.getAccounts()
```

```javascript
/* 
  Get Account
  GET /api/v1/accounts/<accountId>
  params {
    id: accountId
  }
*/
api.getAccountById(params)
```

```javascript
/* 
  Create Account
  POST /api/v1/accounts
  params = {
    type: string ['main' || 'trade']
    currency: string
  }
*/
api.createAccount(params)
```

```javascript
/*  
  Get Account Ledgers
  GET /api/v1/accounts/<accountId>/ledgers
  params = {
    id: string
    startAt: long (unix time)
    endAt: long (unix time)
  }
*/
api.getAccountLedgers(params)
```

```javascript
/* 
  Get Holds
  GET /api/v1/accounts/<accountId>/holds
  params = {
    id: string
  }
*/
api.getHolds(params)
```

```javascript
/*  
  Inner Transfer
  POST /api/accounts/inner-transfer
  params = {
    clientOid: string
    currency: string,
    from: string
    to: string
    amount: string
  }
*/
api.innerTransfer(params)
```

```javascript
/*  
  Create Deposit Address
  POST /api/v1/deposit-addresses
  params = {
    currency: string
  }
*/
api.createDepositAddress(params)
```

```javascript
/* 
  Get Deposit Address
  GET /api/v1/deposit-addresses?currency=<currency>
  params = {
    currency: string
  }
*/
api.getDepositAddress(params)
```

```javascript
/* 
  Get Deposit List
  GET /api/v1/deposits
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
api.getDepositList(params)
```

```javascript
/* 
  Get Margin Account
  GET /api/v1/margin/account
*/
api.getMarginAccount()
```

```javascript
/*  
  Get Withdrawals List
  GET /api/v1/withdrawals
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
api.getWithdrawalsList(params)
```

```javascript
/* 
  Get Repay Record
  GET /api/v1/margin/borrow/outstanding
  params = {
    currency: string [optional]
    currentPage: string [optional (default 1)]
    pageSize: string [optional (default 50)]
  }
*/
api.getRepayRecord(params)
```


```javascript
/* 
  Get Withdrawal Quotas
  GET /api/v1/withdrawals/quotas
  params = {
    currency: string
  }
*/
api.getWithdrawalQuotas(params)
```

```javascript
/* 
  Apply Withdrawal
  POST /api/v1/withdrawals
  params = {
    currency: string
    address: string
    amount: number
    memo: string [optional]
    isInner: boolean [optional]
    remark: string [optional]
  }
*/
api.applyForWithdrawal(params)
```

```javascript
/* 
  Cancel Withdrawal
  DELETE /api/v1/withdrawls/<withdrawlId>
  params = {
    withdrawalId: string
  }
*/
api.cancelWithdrawal(params)
```

```javascript
/* 
  Get V1 Historical Withdrawals List
  GET /api/v1/hist-withdrawals
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
api.getV1HistoricalWithdrawls(params)
```

```javascript
/* 
  Get V1 Historical Deposits List
  GET /api/v1/hist-deposits
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
api.getV1HistoricalDeposits(params)
```

## Trade Endpoints (Private)


```javascript
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
api.placeOrder(params)
```

```javascript
/* 
  Cancel an order
  DELETE /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
api.cancelOrder(params)
```

```javascript
/* 
  Cancel all orders
  DELETE /api/v1/orders
  params = {
    symbol: string [optional]
  }
*/
api.cancelAllOrders(params)
```

```javascript
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
api.getOrders(params)
```

```javascript
/* 
  Get an order
  GET /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
api.getOrderById(params)
```

```javascript
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
api.listFills(params)
```

```javascript
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
api.getV1HistoricalOrders(params)
```

## Websockets

The websocket component of the API wrapper is utilized by initializing websockets based on topics that match Kucoin endpoints. These include:

- 'ticker'
- 'allTicker'
- 'symbolSnapshot'
- 'marketSnapshot'
- 'orderbook'
- 'match'
- 'fullMatch' (optional - private)
- 'orders' (private)
- 'balances' (private)

To initialize a websocket, provide the paramaters and an event handler. A simple example is as follows:

```javascript
// Parameters 
params = {
  topic: enum (see above)
  symbols: array (ignored if not required by the endpoint, single array element if single, multiple if desired)
}

// Public streaming websocket for the orderbook of the provide symbol(s)
api.initSocket({topic: "orderbook", symbols: ['KCS-BTC']}, (msg) => {
  let data = JSON.parse(msg)
  console.log(data)
})

// Private streaming websocket for account balances
api.initSocket({topic: "balances"}, (msg) => {
  let data = JSON.parse(msg)
  console.log(data)
})
```

The event handler can be programmed to manipulate/store the returned websocket stream data as desired.

## Donation Addresses

BTC: 3KvTuAnv7o2VAf4LGgg1MiDURd2DgjFGaa


ETH: 0x7713a223e0e86355ac02b1e0de77695e822071cf 


NEO: AWngpjmoXPHiJH6rtf81brPiyPomYAqe8j  

Contact me for any other specific cryptocurrencies you'd prefer to use.

## License

This project is open source and uses the ISC license. Feel free to utilize it in whatever way you see fit.

