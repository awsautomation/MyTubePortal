// eslint-disable-next-line
const boxcast = window.boxcast
const portalCfg = window.BOXCAST_PORTAL
if (!boxcast) {
  alert('BoxCast JavaScript library not found. Application will not function.')
}
if (!portalCfg) {
  alert('BoxCast application portal not configured. Application will not function.')
}

const API_ROOT = 'https://api.boxcast.com'

function parseJson (r) {
  return r.json()
}

class Cache {
  _data = {}

  set (k, v) {
    this._data[k] = v
  }

  get (k) {
    return this._data[k]
  }
}

let cache = new Cache()

// Access BoxCast API with proper caching and memoization
export default {
  getAccountChannelId: function () {
    return portalCfg.channelId
  },
  getAccount: function () {
    let k = `account:${portalCfg.accountId}`
    if (cache.get(k)) { return Promise.resolve(cache.get(k)) }
    return boxcast.utils.fetch(`${API_ROOT}/accounts`)
      .then(parseJson)
      .then((a) => {
        cache.set(k, a)
        return a
      })
  },
  getChannels: function () {
    let k = `channels:${portalCfg.accountId}`
    if (cache.get(k)) { return Promise.resolve(cache.get(k)) }
    return boxcast.utils.fetch(`${API_ROOT}/accounts/${portalCfg.accountId}/channels`)
      .then(parseJson)
      .then((a) => {
        cache.set(k, a)
        return a
      })
  },
  getChannelById: function (channelId) {
    let k = `channel:${channelId}`
    if (cache.get(k)) { return Promise.resolve(cache.get(k)) }
    return boxcast.utils.fetch(`${API_ROOT}/channels/${channelId}`)
      .then(parseJson)
      .then((a) => {
        cache.set(k, a)
        return a
      })
  },
  getChannelBroadcasts: function (channelId, args) {
    // No caching here, keep it fresh
    return boxcast.getChannelBroadcasts(channelId, args)
  }
}
