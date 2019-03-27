const sha1 = require('./sha1')


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const wxPromise = (fn, obj = {}) => {
  let pormiseObj = new Promise((resolve, reject) => {
    obj.success = (res) => {
      resolve(res)
    };
    obj.fail = (res) => {
      reject(res)
    };
    fn(obj)
  })
  return pormiseObj
}

const getRandom = () => {
  return Math.floor(Math.random() * 10000000000000000);
}

const request = (method, url, params = {}, needEncrypt = true, isLoading = true, contentType = 'application/x-www-form-urlencoded') => {
  return new Promise((resolve, reject) => {
    const server = 'http://121.196.221.90:8080'
    isLoading && wxPromise(wx.showLoading, {
      mask: true,
      title: '加载中...'
    })
    let hearderObj = {
      'content-type': contentType
    }
    if (needEncrypt === true) {
      let random = getRandom()
      hearderObj['nonce'] = random
      let timestamp = +new Date()
      hearderObj['timestamp'] = timestamp
      let signature = sha1.hex_sha1(wx.getStorageSync('token') + random + timestamp)
      hearderObj['signature'] = signature
      hearderObj['uid'] = wx.getStorageSync('uid')
      hearderObj['orgId'] = wx.getStorageSync('orgId')
    }
    if (needEncrypt && !wx.getStorageSync('isLogin')) {
      isLoading && (wx.hideLoading());
      return
    }
    wx.request({
      url: server + url,
      data: params,
      method: method,
      header: hearderObj,
      success(res) {
        isLoading && (wx.hideLoading());
        if (res.statusCode === 200) {
          if (res.data.statusCode === 0) {
            wx.showToast({
              title: res.data.responseMsg,
              icon: 'none',
              duration: 1500
            })
          }
          resolve(res.data)
        } else if (res.statusCode === 401) {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.request({
                  url: server + '/miniProgram/zq/login',
                  data: {
                    code: res.code
                  },
                  method: "post",
                  header: {
                    'content-type': contentType
                  },
                  success: function (data) {
                    if (data.data.statusCode == 200) {
                      wx.setStorage({
                        key: "token",
                        data: data.data.data.token,
                        success: () => {
                          wx.setStorage({
                            key: "uid",
                            data: data.data.data.uid,
                            success: () => {
                              wx.setStorage({
                                key: "cellphone",
                                data: data.data.data.cellphone,
                                success: () => {
                                  if (needEncrypt === true) {
                                    let random = getRandom()
                                    hearderObj['nonce'] = random
                                    let timestamp = +new Date()
                                    hearderObj['timestamp'] = timestamp
                                    let signature = sha1.hex_sha1(wx.getStorageSync('token') + random + timestamp)
                                    hearderObj['signature'] = signature
                                    hearderObj['uid'] = wx.getStorageSync('uid')
                                  }
                                  wx.request({
                                    url: server + url,
                                    data: params,
                                    method: method,
                                    header: hearderObj,
                                    success(res) {
                                      isLoading && (wx.hideLoading());
                                      if (res.statusCode === 200) {
                                        resolve(res.data)
                                      }
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    } else if (data.data.statusCode == 801) {
                      wx.setStorage({
                        key: 'isLogin',
                        data: false,
                        success: function () {
                          wx.removeStorage({
                            key: 'token',
                            success: function () {
                              wx.redirectTo({
                                url: '/pages/login/login',
                              })
                            },
                          })
                        }
                      })
                    }
                  }
                })
              } else {
                console.log('获取code失败' + res.errMsg)
              }
            },
            fail: function () {
              console.log("启用wx.login函数，失败！");
            },
            complete: function () {
              console.log("已启用wx.login函数");
            }
          })
        }
      },
      fail(err) {
        isLoading && (wx.hideLoading());
        reject(err) // 把错误信息传出去
      },
      complete(res) {
        // console.log(res)
      }
    })
  })
}
/**
 *
 * @param code
 * @param zeroNum
 * @returns {string}
 */
const addZero = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}

/**
 * 改格式为YYYY-MM-DD
 */
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 改格式为YYYYMMDD
 */
const formatDate2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('')
}

/**
 * 定义一系列的转换规则
 */

const binary2Json = (buffer) => {
  const view = new DataView(buffer)
}



function debounce(fn, wait = 5000) {
  var timer = null
  let firstTime
  let clickCount = 0
  return function() {
    clickCount++
    var args = arguments
    if (timer) {
      clearTimeout(timer);
    } else {
      firstTime = new Date()
      fn.apply(this, args)
      return
    }
    timer = setTimeout(() => {
      timer = null
      if (clickCount > 1) {
        fn.apply(this, args)
      } else {
        firstTime = ''
        clickCount = 0
      }
    }, wait - (new Date() - firstTime))
  }
}

function throttle(fn, gapTime = 1500) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

const formatTimeYmd = oldTime => { // 将毫秒时间戳转化为年月日（2001-01-01）
  let newTime = new Date(oldTime)
  let ytime = newTime.getFullYear() + '-'
  let mtime = ((newTime.getMonth() + 1) < 10 ? '0' : '') + (newTime.getMonth() + 1) + '-'
  let dtime = (newTime.getDate() < 10 ? '0' : '') + newTime.getDate()
  return ytime + mtime + dtime
}
const formatDateSmall = oldTime => {
  let newTime = new Date(oldTime)
  let ytime = newTime.getFullYear()
  let mtime = ((newTime.getMonth() + 1) < 10 ? '0' : '') + (newTime.getMonth() + 1)
  let dtime = (newTime.getDate() < 10 ? '0' : '') + newTime.getDate()
  return ytime + mtime + dtime
}
const formatSmallNumber = oldData => {
  if (oldData > 100000000) {
    return (oldData / 100000000).toFixed(2) + '亿'
  }
  if (oldData > 10000) {
    return (oldData / 10000).toFixed(2) + '万'
  }
}
/**
   * 计算威廉指标
   * @param Cn 第n日的收盘价
   * @param Hn n日内的最高价
   * @param Ln n日内的最低价
   * @returns {number}
   */
 const calculateWR = function(Cn, Hn, Ln) {
    let wr = 0
    if (Cn !== undefined && Hn !== undefined && Ln !== undefined) {
      if ((Hn - Ln) !== 0) {
        wr = (Hn - Cn) / (Hn - Ln) * 100
      }
    }
    return wr
  }
/**
   * 计算当日K值
   * @param lastKvalue 前一日K值
   * @param Rsv
   * @returns {number}
   */
 const calculateKvalue = function(lastKvalue, Rsv, m1) {
    let Kvalue = 0
    if (lastKvalue !== undefined && Rsv !== undefined) {
      Kvalue = (m1 - 1) / m1 * lastKvalue + 1 / m1 * Rsv
    }

    return Kvalue
  }
  /**
   * 计算当日J值
   * @param currentKvalue 当日K值
   * @param currentDvalue 当日D值
   * @returns {number}
   */
 const calculateJvalue = function(currentKvalue, currentDvalue) {
    let Jvalue = 3 * currentKvalue - 2 * currentDvalue
    return Jvalue
  }
   /**
   * 计算RSV
   * @param Cn 第n日的收盘价
   * @param Hn n日内的最高价
   * @param Ln n日内的最低价
   * @returns {number}
   */
  const calculateRSVn = function(Cn, Hn, Ln) {
    let rsv = 0
    if (Cn !== undefined && Hn !== undefined && Ln !== undefined) {
      if ((Hn - Ln) !== 0) {
        rsv = (Cn - Ln) / (Hn - Ln) * 100
      }
    }
    return rsv
  }
  /**
   * 计算当日D值
   * @param lastDvalue 前一日D值
   * @param currentKvalue 当日K值
   * @returns {number}
   */
  const calculateDvalue = function(lastDvalue, currentKvalue, m2) {
    let Dvalue = 0
    if (lastDvalue !== undefined && currentKvalue !== undefined) {
      Dvalue = (m2 - 1) / m2 * lastDvalue + 1 / m2 * currentKvalue
    }
    return Dvalue
  }

module.exports = {
  formatTime,
  formatTimeYmd,
  formatDateSmall,
  formatDate,
  formatDate2,
  debounce,
  addZero,
  throttle,
  request,
  formatSmallNumber,
  calculateKvalue,
  calculateJvalue,
  calculateRSVn,
  calculateWR,
  calculateDvalue
}
