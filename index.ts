import { ParsedUrlQuery, stringify } from "querystring"
import { createHmac } from "node:crypto"
import User from './lib/user'
import Market from './lib/market'
import Trade from './lib/trade'
import Sockets from './lib/websockets'

interface InitMethod {
  (config: KucoinNodeApiConfig): void;
}

interface SignMethod {
  (endpoint: string, urlQueryObj: ParsedUrlQuery, method: string): void;
}
interface FormatQueryMethod {
  (urlQueryObj: ParsedUrlQuery): string;
}

export interface KucoinNodeApiConfig {
  apiKey: string;
  secretKey: string;
  passphrase: string;
  environment: string;
}

interface KucoinHeaders {
  'KC-API-SIGN': string;
  'KC-API-TIMESTAMP': string
  'KC-API-KEY': string
  'KC-API-PASSPHRASE': string
  'KC-API-KEY-VERSION': number
  'Content-Type': string
}

class KucoinNodeApi {
  environment: string;
  baseURL: string;
  secretKey: string;
  apiKey: string;
  passphrase: string;

  constructor(config: KucoinNodeApiConfig) {
    let url = ''
    if (config.environment === 'live') {
      url = 'https://api.kucoin.com'
    } else {
      url = 'https://openapi-sandbox.kucoin.com'
    }
    this.environment = config.environment
    this.baseURL = url
    this.secretKey = config.secretKey
    this.apiKey = config.apiKey
    this.passphrase = config.passphrase
  }
  public sign(endpoint: string, urlQueryObj: ParsedUrlQuery, method: string): KucoinHeaders {
    let nonce = Date.now() + ''
    let strForSign = ''
    if (method === 'GET' || method === 'DELETE') {
      strForSign = nonce + method + endpoint + this._formatQuery(urlQueryObj)
    } else {
      strForSign = nonce + method + endpoint + JSON.stringify(urlQueryObj)
    }
    let signatureResult = createHmac('sha256', this.secretKey)
      .update(strForSign)
      .digest('base64')
    let passphraseResult = createHmac('sha256', this.secretKey)
      .update(this.passphrase)
      .digest('base64')
    return {
      'Content-Type': 'application/json',
      'KC-API-SIGN': signatureResult,
      'KC-API-TIMESTAMP': nonce,
      'KC-API-KEY': this.apiKey,
      'KC-API-PASSPHRASE': passphraseResult,
      'KC-API-KEY-VERSION': 2,
    }
  }
  private _formatQuery(urlQueryObj: ParsedUrlQuery) {
    if (JSON.stringify(urlQueryObj).length !== 2) {
      return '?' + stringify(urlQueryObj)
    } else {
      return ''
    }
  }
}

export { KucoinNodeApi, User, Market, Trade, Sockets }