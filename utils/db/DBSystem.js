class DBSystem {
  constructor() {

  }
  getDataByKey(key, option) {
    option = Object.assign({
      url: '',
      type: 'remote', // local or remote
      defaultValue: []
    }, option)
    let res = wx.getStorageSync(key)
    if(!res) {
      if(option === 'remote') {
        // ajax
      } else {
        if(option.url !== '') {
          res = require(option.url)
        } else {
          res = option.defaultValue
        }
      }
      // res = require(url)
      this.execSetStorageSync(key, res)
    }
    if(option !== 'remote') {
      return res
    }
  }

  execSetStorageSync(key, data) {
    wx.setStorageSync(key, data)
  }  
}

export { DBSystem } 
