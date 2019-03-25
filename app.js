// 初始化设置
const util = require('./utils/util.js')
// const settingItems = {
//   kSizeLevel: 2, // 本地默认level等级
//   kDate: {
//     start: startDate,
//     end: endDate
//   },
//   dateArr: []
// }

const getStorage = function (key, defaultValue) {
  let val = wx.getStorageSync(key)
  if (val == '') {
    val = defaultValue
  }
  return val
}

const addZeroAfter = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.push('0')
  }
  return code.join('')
}
//app.js
const defaultStockCode = '010001'
App({
  onLaunch: function () {
    wx.onMemoryWarning(() => {
      console.log('警告内存占用过多！！！')
    })

    
  },
  onShow() {
    const constKey = ['a105', 'a106', 'a109']
    for (let i = 0; i < constKey.length; i++) {
      let key = addZeroAfter(constKey[i], 31)
      let data = getStorage(key, null)
      if (data) {
        this.globalData[key] = this.globalData[constKey[i]] = data
      }
    }

    // t109为日历文件
    // let key = addZeroAfter('a109', 31)
    // let t109 = wx.getStorageSync(key).data
    // if(t019 != '') {
    //   this.globalData.a109 = 
    // }
    // let sizeLevel = wx.getStorageSync('kSizeLevel')
    // if (sizeLevel !== '') {
    //   this.globalData.kSizeLevel = sizeLevel
    // } else {
    //   this.globalData.kSizeLevel = 2
    // }
    // let kDate = getStorage('kDate', null)
    // this.globalData.kDate = kDate
    // let kDateArr = getStorage('kDateArr', [])
    // this.globalData.kDateArr = kDateArr
    // let k105 = getStorage('k105000000000000000000000000000', [])
    // this.globalData.k105 = this.globalData.a105  = k105
    let settingItem = wx.getStorageSync('settingItem')
    if (settingItem) {
      this.globalData.settingItem = settingItem
    }
  },
  onHide() {
  },
  globalData: {
    indicatorSetting: {
      kdj1: 9,
      rsi1: 6,
      rsi2: 12,
      rsi3: 24,
      wr1: 10,
      wr2: 6,
      boll1: 20,
      boll2: 2,
      bias1: 6,
      bias2: 12,
      bias3: 21
    },
    selectStock: {
      code: '010001',
      stockName: '平安银行',
      stockNo: '000001'
    },
    userInfo: null,
    stockList: null,
    kSizeLevel: 2,
    kDate: null,
    kDateArr: [],
    k105: [],
    settingItem: {
      jhjj: false,
      fsjx: false,
      fsjlx: false,
      ydjx: {
        show: true,
        period: [5, 10]
      },
      cbjx: {
        show: false,
        period: [5, 10]
      },
      cjljx: {
        show: true,
        period: [5, 10]
      },
      beforeRf: true
    }
  }
})