const axios = require('axios')

const User = {}

/* 
  List Accounts
  GET /api/v1/accounts
  params = {
    currency: string [optional]
    type: string [optional]
  }
*/
User.getAccounts = async function(params = {}) {
  let endpoint = '/api/v1/accounts'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Account
  GET /api/v1/accounts/<accountId>
  params {
    id: accountId
  }
*/
User.getAccountById = async function(params) {
  let endpoint = '/api/v1/accounts/' + params.id
  delete params.id
  let url = this.baseURL + endpoint
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Create Account
  POST /api/v1/accounts
  params = {
    type: string ['main' || 'trade']
    currency: string
  }
*/
User.createAccount = async function(params) {
  let endpoint = '/api/v1/accounts'
  let url = this.baseURL + endpoint
  let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/*  
  Get Account Ledgers
  GET /api/v1/accounts/<accountId>/ledgers
  params = {
    id: string
    startAt: long (unix time)
    endAt: long (unix time)
  }
*/
User.getAccountLedgers = async function(params) {
  let endpoint = `/api/v1/accounts/${params.id}/ledgers`
  delete params.accountId
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Holds
  GET /api/v1/accounts/<accountId>/holds
  params = {
    id: string
  }
*/
User.getHolds = async function(params) {
  let endpoint = `/api/v1/accounts/${params.id}/holds`
  delete params.id
  let url = this.baseURL + endpoint
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

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
User.innerTransfer = async function(params) {
  let endpoint = '/api/v2/accounts/inner-transfer'
  let url = this.baseURL + endpoint
  let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/*  
  Create Deposit Address
  POST /api/v1/deposit-addresses
  params = {
    currency: string
  }
*/
User.createDepositAddress = async function(params) {
  let endpoint = '/api/v1/deposit-addresses'
  let url = this.baseURL + endpoint
  let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/* 
  Get Deposit Address
  GET /api/v1/deposit-addresses?currency=<currency>
  params = {
    currency: string
  }
*/
User.getDepositAddress = async function(params) {
  let endpoint = `/api/v2/deposit-addresses?currency=${params.currency}`
  delete params.currency
  let url = this.baseURL + endpoint
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Repay Record
  GET /api/v1/margin/borrow/outstanding
  params = {
    currency: string [optional]
    currentPage: string [optional (default 1)]
    pageSize: string [optional (default 50)]
  }
*/
User.getRepayRecord = async function(params = {}) {
  let endpoint = `/api/v1/margin/borrow/outstanding`
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}


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
User.getDepositList = async function(params = {}) {
  let endpoint = '/api/v1/deposits'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Margin Account
  GET /api/v1/margin/account
*/
User.getMarginAccount = async function() {
  const endpoint = '/api/v1/margin/account'
  const url = this.baseURL + endpoint
  const result = await axios.get(url, this.sign(endpoint, "", 'GET'))
  return result.data
}

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
User.getWithdrawalsList = async function(params = {}) {
  let endpoint = '/api/v1/withdrawals'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

/* 
  Get Withdrawal Quotas
  GET /api/v1/withdrawals/quotas
  params = {
    currency: string
  }
*/
User.getWithdrawalQuotas = async function(params) {
  let endpoint = '/api/v1/withdrawals/quotas'
  let url = this.baseURL + endpoint  + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

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
User.applyForWithdrawal = async function(params) {
  let endpoint = '/api/v1/withdrawals'
  let url = this.baseURL + endpoint
  let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'))
  return result.data
}

/* 
  Cancel Withdrawal
  DELETE /api/v1/withdrawls/<withdrawlId>
  params = {
    withdrawalId: string
  }
*/
User.cancelWithdrawal = async function(params) {
  let endpoint = '/api/v1/withdrawls/' + params.withdrawalId
  delete params.withdrawalId
  let url = this.baseURL + endpoint
  let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'))
  return result.data
}

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
User.getV1HistoricalWithdrawals = async function(params) {
  let endpoint = '/api/v1/hist-withdrawals'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

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
User.getV1HistoricalDeposits = async function(params) {
  let endpoint = '/api/v1/hist-deposits'
  let url = this.baseURL + endpoint + this.formatQuery(params)
  let result = await axios.get(url, this.sign(endpoint, params, 'GET'))
  return result.data
}

module.exports = User
