//index.js
//获取应用实例
const util = require('../../utils/util.js')
let socket = require('../../utils/socket.js')
import {
  throttle
} from '../../utils/util.js'
import debounce from '../../utils/debounce.js'
import {
  connect
} from '../../utils/socket.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'
import EventBus from '../../utils/pubsub.js'
import WXStorage from '../../utils/WXStorage.js'

const app = getApp()

const addZero = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}
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

const deal2SixPart2 = function (originData, page = 1) {

  let data = {
    page,
    aos: [], // 全部类型
    os: [], // 机构专用
    hk: [], // 港股通
    dp: [], // 全部营业部
    m50: [], // 最近一个月排名前50的活跃营业部
    y50: [],  // 最近一年排名前50的活跃营业部
  }

  originData.forEach(element => {
    let aosTmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.qbBuy,
      s: element.qbSell,
    }
    data.aos.push(aosTmpl)
    let osTmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.jgBuy,
      s: element.jgSell
    }
    data.os.push(osTmpl)
    let hkTmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.hgtBuy,
      s: element.hgtSell
    }
    data.hk.push(hkTmpl)
    let dpTmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.allyybBuy,
      s: element.allyybSell
    }
    data.dp.push(dpTmpl)
    let m50Tmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.monthyybBuy,
      s: element.monthyybSell
    }
    data.m50.push(m50Tmpl)
    let y50Tmpl = {
      t: element.t,
      y: element.isOnList,
      b: element.yearyybBuy,
      s: element.yearyybSell
    }
    data.y50.push(y50Tmpl)
  })
  return data
}

const deal2SixPart = function (originData, page = 1) {

  let data = {
    page,
    aos: [], // 全部类型
    os: [], // 机构专用
    hk: [], // 港股通
    dp: [], // 全部营业部
    m50: [], // 最近一个月排名前50的活跃营业部
    y50: [],  // 最近一年排名前50的活跃营业部
  }

  originData.forEach(element => {
    let aosTmpl = {
      t: element.t,
      b: element.qbBuy,
      s: element.qbSell,
    }
    data.aos.push(aosTmpl)
    let osTmpl = {
      t: element.t,
      b: element.jgBuy,
      s: element.jgSell
    }
    data.os.push(osTmpl)
    let hkTmpl = {
      t: element.t,
      b: element.hgtBuy,
      s: element.hgtSell
    }
    data.hk.push(hkTmpl)
    let dpTmpl = {
      t: element.t,
      b: element.allyybBuy,
      s: element.allyybSell
    }
    data.dp.push(dpTmpl)
    let m50Tmpl = {
      t: element.t,
      b: element.monthyybBuy,
      s: element.monthyybSell
    }
    data.m50.push(m50Tmpl)
    let y50Tmpl = {
      t: element.t,
      b: element.yearyybBuy,
      s: element.yearyybSell
    }
    data.y50.push(y50Tmpl)
  })
  return data
}

const deal2StockData = function (originData, page = 1) {
  let data = {
    page,
    qk: [], // 缺口
    zd: [], // 涨跌
    jj: [], // 竞价
    kp: [], // 开盘
    wp: [], // 尾盘
  }
  originData.forEach(element => {
    let tempData1 = {
      t: element.t,
      y: 0
    }
    let tempData2 = {
      t: element.t,
      y: 0
    }
    let tempData3 = {
      t: element.t,
      y: 0
    }
    let tempData4 = {
      t: element.t,
      y: 0
    }
    let tempData5 = {
      t: element.t,
      y: 0
    }
    for (let key in element) {
      switch (key) {
        case '11': // 向上
          tempData1.y += element[key]
          break
        case '13': // 向下
          tempData1.y += -element[key]
          break
        case '51': // 涨停
          tempData2.y += element[key]
          break
        case '61': // 跌停
          tempData2.y += -element[key]
          break
        case '21': // 竞价
          tempData3.y += element[key]
          break
        case '24': // 开盘
          tempData4.y += element[key]
          break
        case '26': //尾盘
          tempData5.y += element[key]
          break
      }
    }
    data.qk.push(tempData1)
    data.zd.push(tempData2)
    data.jj.push(tempData3)
    data.kp.push(tempData4)
    data.wp.push(tempData5)
  })
  return data
}

const deal2FiveData = function (originData, page = 1) {
  let data = {
    page,
    qk: [], // 缺口
    zd: [], // 涨跌
    jj: [], // 竞价
    kp: [], // 开盘
    wp: [], // 尾盘
  }
  originData.forEach(element => {
    let tempData1 = {
      t: element.t
    }
    let tempData2 = {
      t: element.t
    }
    let tempData3 = {
      t: element.t
    }
    let tempData4 = {
      t: element.t
    }
    let tempData5 = {
      t: element.t
    }
    for (let key in element) {
      switch (key) {
        case '11': // 向上
          tempData1.y1 = element[key]
          break
        case '13': // 向下
          tempData1.y2 = -element[key]
          break
        case '51': // 涨停
          tempData2.y1 = element[key]
          break
        case '61': // 跌停
          tempData2.y2 = -element[key]
          break
        case '21': // 竞价
          tempData3.y = element[key]
          break
        case '24': // 开盘
          tempData4.y = element[key]
          break
        case '26': //尾盘
          tempData5.y = element[key]
          break
      }
    }
    data.qk.push(tempData1)
    data.zd.push(tempData2)
    data.jj.push(tempData3)
    data.kp.push(tempData4)
    data.wp.push(tempData5)
  })
  return data
}
Page({
  data: {
    // date: '2019-01-29',
    date: util.formatDate(new Date()),
    currentType: 'kline',
    date2: util.formatDate(new Date()),
    // date: '2018-12-28',
    agentInfo: {},
    static105: false,
    static106: false,
    static109: false,
    getAllStatic: true,
    selectIndex: 2,
    isStock: false,
    diagramLeft: false,
    infoLsData: [], //资料历史数据
    diagramRight: false,
    underViewHeight: 300,
    diagramWidth: 0,
    diagramHeight: 0,
    volStart: 0,
    volEnd: 0,
    itemList: [],
    volWidth: 0,
    rwLocal: true,
    volInterval: 0,
    dealHeight: 0,
    dealWidth: 0,
    barGraphHeight: 60,
    stockCode: '010001',
    stockInfo: {
      name: '平安银行',
      stockNo: '000001'
    },
    agentInfo: [],
    agentDetail: [],
    drawData: {
      data: []
    },
    bottomTab: ['盘口', '龙虎榜', '公告', '资料', '两融', '自选', '指标'],
    ydlsData: {},
    ydCurrentData: {},
    ydStockLsData: {},
    ydStockCurrentData: {},
    showCurrentInfo: false,
    showKInfo: false,
    showDeal: true,
    kLinesData: {},
    kLinesDataCurrent: {},
    stockPcp: 0,
    handle112: null,
    storage: null,
    openjhjjFlag: false,
    showCurrentInfoHandle: null,
    showKInfoHandle: null,
    currentInfo: {},
    kInfo: {},
    rfArr: [],
    tabSelect: 0,
    settingTmp: {},
    kSettingItem: {},
    popUpTime: 1,
    popUpTimeOut: null,
    dateBottom: util.formatTimeYmd(new Date()),
    t101: null,
    t106: null,
    t102: null,
    stockDetailData: null,
    subSelect: 1,
    sideSelect: 1,
    bestSelectData: null,
    t103: null,
    t106: null,
    bottomIndex: 1,
    t134: null,
    tabCanClick: true,
    t138: null,
    t139: null,
    t140: null,
    t136: null,
    t137: null,
    t126: null,
    t107: null
  },
  getToken(){
    wx.login({
      success: (res) => {
        if (res.code) {
          util.request('post', '/miniProgram/zq/login', {
            code: res.code
          }, false).then((data) => {
            app.globalData.token = data.token
            this.isHasStaticData()
          })
        } else {
          console.log('获取code失败' + res.errMsg)
        }
      },
      fail: function() {
        console.log("启用wx.login函数，失败！");
      },
      complete: function() {
        console.log("已启用wx.login函数");
      }
    })
  },
  getOtherData(){
    let otherFlieList = [{
      type: '101',
      intervalTime: 9000,
      changeCb: (data) => {
        this.setData({
          t101: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(101, '000000', '000000', true)
        return val
      }
    },  {
      type: '108',
      changeCb: (data) => {
        let stockInfo = {
          current: data.data.current,
          rise: data.data.rise,
          high: data.data.high,
          low: data.data.low,
          close: data.data.close,
          open: data.data.open,
          hand: data.data.hand,
          volume: data.data.volume
        }
        this.setData({
          stockInfo: Object.assign({}, this.data.stockInfo, stockInfo)
        })
      },
      intervalTime: 10000,
      createKey: () => {
        const TYPE = 108
        let val = this.createKeyStr3(108, '000000', this.data.stockCode, true)
        return val
      }
      // isCallMainBack: false
    }, {
      type: '110',
      changeCb: (data) => {
        this.setData({
          agentInfo: data
        })
      },
      intervalTime: 5000,
      createKey: () => {
        let val = this.createKeyStr3(110, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '122',
      intervalTime: 5000,
      changeCb: (data) => {
        for (let j = 0; j < data.data.length; j++) {
          let flag = true
          for (let i = 0; i < this.data.agentDetail.length; i++) {
            if (this.data.agentDetail[i].time == data.data[j].time) {
              this.data.agentDetail[i] = data.data[j]
              flag = false
            }
          }
          if (flag) {
            this.data.agentDetail.push(data.data[j])
          }
        }
        this.setData({
          agentDetail: this.data.agentDetail,
          stockPcp: data.pcp
        })
        data.data = this.data.agentDetail
        
        return data
      },
      createKey: () => {
        let val = this.createKeyStr(122, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '113',
      changeCb: (data) => {

        this.setData({
          kLinesData: data
        })
      },
      createKey: () => {

        let val = this.createKeyStr3(113, '000000', this.data.stockCode, true, 0, true)
        return val
      }
    }, {
      type: '114',
      intervalTime: 7000,
      changeCb: (data) => {

        this.setData({
          kLinesDataCurrent: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr3(114, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '117',
      changeCb: (data) => {
        this.setData({
          rfArr: data.data
        })
      },
      createKey: () => {

        let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '104',
      changeCb: (data) => {
        this.setData({
          stockDetailData: data
        })
        wx.setStorageSync('page104' + addZero(this.data.stockCode, 6), data.totalPage)
      },
      createKey: () => {
        let val = this.createKeyStr3(104, '000000', this.data.stockCode, true, 0, true)
        return val
      }
    }, {
      type: '126',
      intervalTime: 8000,
      changeCb: (data) => {
        // let oldData = wx.getStorageSync('k126000000000000000000000000000')
        let oldData = {
          data: []
        }
        if (this.data.t126) {
          oldData = this.data.t126
        }
        for (let i = 0; i < data.data.length; i++) {
          let flag = true
          for (let j = 0; j < oldData.data.length; j++) {
            if (data.data[i].no == oldData.data[j].no && data.data[i].stockCode == oldData.data[j].stockCode && data.data[i].time == oldData.data[j].time && data.data[i].value == oldData.data[j].value) {
              oldData.data[j] = data.data[i]
              flag = false
            }
          }
          if (flag) {
            oldData.data.push(data.data[i])
          }
        }
        data.data = oldData.data.slice(-50)
        this.setData({
          t126: data
        })
        return data
      },
      createKey: () => {
        let val = this.createMonitorStr(126, '000000', '000000')
        return val
      }
    }]
    let storage
    if(this.data.storage) {
      storage = this.data.storage
      for(let i = 0; i < otherFlieList.length; i++) {
        storage.addFile(otherFlieList[i])
      }
    } else {
      storage = new WXStorage(otherFlieList, this, () => {})
    }
  },
  //事件处理函数
  hideDeal() {
    this.setData({
      showDeal: !this.data.showDeal
    })
    if(this.data.showDeal) {
      this.data.storage.addFile({
        type: '110',
        changeCb: (data) => {
          this.setData({
            agentInfo: data
          })
        },
        intervalTime: 10000,
        createKey: () => {
          let val = this.createKeyStr3(110, '000000', this.data.stockCode, true)
          return val
        }
      })
      this.data.storage.addFile({
        type: '122',
        intervalTime: 5000,
        changeCb: (data) => {
          for (let j = 0; j < data.data.length; j++) {
            let flag = true
            for (let i = 0; i < this.data.agentDetail.length; i++) {
              if (this.data.agentDetail[i].time == data.data[j].time) {
                this.data.agentDetail[i] = data.data[j]
                flag = false
              }
            }
            if (flag) {
              this.data.agentDetail.push(data.data[j])
            }
          }
          this.setData({
            agentDetail: this.data.agentDetail,
            stockPcp: data.pcp
          })
          data.data = this.data.agentDetail
          return data
        },
        createKey: () => {
          let val = this.createKeyStr(122, '000000', this.data.stockCode, true)
          return val
        }
      })
    } else {
      this.data.storage.deleteFile(110)
      this.data.storage.deleteFile(122)
    }
    wx.setStorageSync('showDeal', this.data.showDeal)
    this.setView()
  },
  changeVolLength(e) {

    this.setData({
      volEnd: e.detail.end,
      volStart: e.detail.start,
      volInterval: e.detail.rectInterval,
      volWidth: e.detail.rectWidth
    })
  },
  showKInfo() {
    // this.data.kSettingItem.kHair = true
    this.setData({
      kSettingItem: this.data.kSettingItem,
      showKInfo: true
    })
    app.globalData.settingItem = this.data.kSettingItem
  },
  changeKInfo(data) {

    this.setData({
      kInfo: data
    })
  },
  changecurrentInfo(currentInfo) {
    this.setData({
      currentInfo,
    })
  },
  showCurrentInfo() {
    // this.data.kSettingItem.fsHair = true
    this.setData({
      kSettingItem: this.data.kSettingItem,
      showCurrentInfo: true
    })
    app.globalData.settingItem = this.data.kSettingItem
  },
  drawCrossHair2(e) {
    this.diagram.moveCrosshair(e.detail.x)
  },
  drawCrossHair(e) {
    this.stockDeal.drawCrossHair(e.detail.x)
  },
  closeKCrosshair() {
    this.setData({
      showKInfo: false
    })
    this.closeAllCrosshair()
  },
  closeAllCrosshair() {

    // if (this.data.kSettingItem.fsHair) {
    this.data.kSettingItem.fsHair = false
    this.setData({
      showCurrentInfo: false
    })
    this.closeCrosshair()
    // }

    // if (this.data.kSettingItem.kHair) {
    this.data.kSettingItem.kHair = false
    EventBus.emit('closecrosshair')
    this.setData({
      showKInfo: false
    })
    // 
    app.globalData.settingItem = this.data.kSettingItem
  },
  changeSelectIndex: debounce(function (e) {
    this.closeAllCrosshair()
    // clearTimeout(this.data.popUpTimeOut)
    // this.setData({
    //   popUpTime: 0
    // })
    // this.data.popUpTimeOut = setTimeout(() => {
    //   this.data.time++
    //   this.setData({
    //     popUpTime: 1
    //   })
    //   this.popup = this.selectComponent("#popup")
    // }, 500)
    let index = parseInt(e.currentTarget.dataset.index)
    let originIndex = parseInt(this.data.selectIndex)


    // EventBus.emit('clearcanvas')
    this.setData({
      selectIndex: index,
      kLinesData: {
        data: null
      },
      kLinesDataCurrent: {
        data: null
      }
    })
    this.initTabSelect()
    let storage = this.data.storage
    switch (originIndex) {
      case 1:
        storage.deleteFile(112)
        break
      case 2:
        storage.deleteFile(113)
        storage.deleteFile(114)
        storage.deleteFile(117)
        break
      case 3:
        storage.deleteFile(115)
        storage.deleteFile(116)
        storage.deleteFile(117)
        break
      case 4:
        storage.deleteFile(118)
        storage.deleteFile(119)
        storage.deleteFile(117)
        break
      case 5:
        storage.deleteFile(123)
        storage.deleteFile(124)
        storage.deleteFile(125)
    }
    if (index >= 2) {
      let type
      switch (this.data.selectIndex) {
        case 2:
          type = 'kline'
          break
        case 3:
          type = 'k5line'
          break
        case 4:
          type = 'k30line'
          break
      }
      // 根据是否是股票请求不同的数据
      if (!this.data.isStock) {
        storage.addFile({
          type: '129',
          changeCb: (data) => {
            // 处理成按时间分割的各个项目

            let itemArr = this.data.itemList

            this.setData({
              ydlsData: deal2FiveData(data.data, data.page)
            })

            // this.setData({
            //   k: data
            // })
          },
          createKey: () => {
            let val = this.createKeyStr3(129, '000000', this.data.stockCode, true, 1, true)
            return val
          }
        })
        storage.addFile({
          type: '128',
          intervalTime: 9000,
          changeCb: (data) => {
            // 处理成当天项目，并传一个标识过去
            // this.setData({
            //   kLinesDataCurrent: data
            // })

            this.setData({
              ydCurrentData: deal2FiveData(data.data)
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(128, '000000', this.data.stockCode, true)
            return val
          }
        })
      } else {
        storage.addFile({
          type: '131',
          intervalTime: 10000,
          changeCb: (data) => {
            // 处理成当天项目，并传一个标识过去
            // this.setData({
            //   kLinesDataCurrent: data
            // })
            this.setData({
              ydStockCurrentData: deal2StockData(data.data)
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(131, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '104',
          changeCb: (data) => {
            this.setData({
              t102: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(104, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '132',
          changeCb: (data) => {
            // 处理成当天项目，并传一个标识过去
            // this.setData({
            //   kLinesDataCurrent: data
            // })

            this.setData({
              ydStockLsData: deal2StockData(data.data, data.page)
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(132, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
      }
    }
    switch (index) {
      case 1:
        // this.setData({
        //   kLinesData: null,
        //   kLinesDataCurrent: null
        // })
        storage.addFile({
          type: '112',
          intervalTime: 10000,
          changeCb: (data) => {
            
            let averagePrice = 0
            let maxDeal = 0
            let beforeDeal = 0
            let beforeDealN = 0
            let count = 0
            let tempData = Object.assign({}, data)
            
            tempData.data = [].concat(this.data.drawData.data)
            if (tempData.data.length === 0) { // 原数据为空则全部拷贝
              tempData.data = tempData.data.concat(data.data)
            } else {
              let equalIndex = 0
              for (let i = 0; i < data.data.length; i++) {
                let lastData = tempData.data[tempData.data.length - 1]
                if (parseInt(data.data[i].date) === parseInt(lastData.date)) {
                  equalIndex = i
                  break
                }
              }
              tempData.data[tempData.data.length - 1] = Object.assign({}, data.data[equalIndex])
              tempData.data = tempData.data.concat(data.data.slice(equalIndex + 1))
            }
            let val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              this.data.drawData.data.length)
              
            app.globalData['a' + val.storage] = Object.assign({}, tempData)
            for (let i = 0, length = tempData.data.length; i < length && i < 256; i++) {

              tempData.data[i].dealA = tempData.data[i].da - beforeDeal
              tempData.data[i].dealN = tempData.data[i].dn - beforeDealN
              if (tempData.data[i].dealA >= maxDeal) {
                maxDeal = tempData.data[i].dealA
              }
              beforeDeal = tempData.data[i].da
              beforeDealN = tempData.data[i].dn
              tempData.data[i]
              if (parseInt(tempData.data[i].date) >= 930) {
                averagePrice = (parseFloat(tempData.data[i].dealPrice) + parseFloat(averagePrice))
                count = count + 1
                tempData.data[i].averagePrice = (averagePrice / count).toFixed(2)
                tempData.data[i].averageDa = Math.round((parseFloat(tempData.data[i].da) / count))
              }

            }
            tempData.maxDeal = maxDeal
            this.setData({
              drawData: tempData
            })

            if (!this.data.showCurrentInfo) {
              let lastData = Object.assign({}, tempData.data[tempData.data.length - 1])
              lastData.date = lastData.date.replace(/(\d{2})(\d{2})/, "$1:$2")
              lastData.price = getNumUnit(lastData.price)
              lastData.dealA = getNumUnit(lastData.dealA)
              lastData.dealN = getNumUnit(lastData.dealN)
              lastData.rise = (parseFloat(lastData.dealPrice) - parseFloat(tempData.pcp)) / parseFloat(tempData.pcp) * 100
              lastData.rise = (lastData.rise).toFixed(2)

              this.setData({
                currentInfo: lastData
              })
            }

            return tempData
          },
          createKey: () => {
            // let length
            // let data = ''
            
            let val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              this.data.drawData.data.length)
              
            if(app.globalData['a' + val.storage]) {
              
              val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              app.globalData['a' + val.storage].totalPage)
            }
            
            return val
          }
        })
        break
      case 2:
        this.klines.initSetting()
        storage.addFile({
          type: '113',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {

            let val = this.createKeyStr3(113, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '114',
          intervalTime: 5000,
          changeCb: (data) => {
            this.setData({
              kLinesDataCurrent: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(114, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {

            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })

        break

      case 3:
        this.klines.initSetting()
        storage.addFile({
          type: '116',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(116, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '115',
          intervalTime: 6000,
          changeCb: (data) => {

            let kLinesDataCurrent = JSON.parse(JSON.stringify(data))
            kLinesDataCurrent.data = this.data.kLinesDataCurrent.data
            if (kLinesDataCurrent.data) {
              for (let i = 0; i < data.data.length; i++) {
                let flag = true
                for (let j = 0; j < kLinesDataCurrent.data.length; j++) {
                  if (data.data[i].date === kLinesDataCurrent.data[j].date && data.data[i].time === kLinesDataCurrent.data[j].time) {
                    flag = false
                    kLinesDataCurrent.data[j] = data.data[i]
                  }
                }
                if (flag) {
                  kLinesDataCurrent.data.push(data.data[i])
                }
              }
            } else {
              kLinesDataCurrent = data
            }
            this.setData({
              kLinesDataCurrent
            })
            return kLinesDataCurrent
          },
          createKey: () => {

            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(115, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
      case 4:
        this.klines.initSetting()
        storage.addFile({
          type: '118',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(118, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '119',
          intervalTime: 7000,
          changeCb: (data) => {
            let kLinesDataCurrent = JSON.parse(JSON.stringify(data))
            kLinesDataCurrent.data = this.data.kLinesDataCurrent.data
            if (kLinesDataCurrent.data) {
              for (let i = 0; i < data.data.length; i++) {
                let flag = true
                for (let j = 0; j < kLinesDataCurrent.data.length; j++) {
                  if (data.data[i].date === kLinesDataCurrent.data[j].date && data.data[i].time === kLinesDataCurrent.data[j].time) {
                    flag = false
                    kLinesDataCurrent.data[j] = data.data[i]
                  }
                }
                if (flag) {
                  kLinesDataCurrent.data.push(data.data[i])
                }
              }
            } else {
              kLinesDataCurrent = data
            }
            this.setData({
              kLinesDataCurrent
            })
            return kLinesDataCurrent
          },
          createKey: () => {
            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(119, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
      case 5:
        this.klines.initSetting()
        storage.addFile({
          type: '123',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(123, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '124',
          intervalTime: 8000,
          changeCb: (data) => {
            this.setData({
              kLinesDataCurrent: data
            })
          },
          createKey: () => {
            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(124, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '125',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            let val = this.createKeyStr(125, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
    }
    this.settingHandler()
  }, 400),
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 打开集合竞价
  openjhjj: function () {
    this.stockDeal.openjhjj()
    this.diagram.openjhjj()
  },
  closejhjj: function () {
    this.stockDeal.closejhjj()
    this.diagram.closejhjj()
  },
  settingHandler() {
    // 分时选项处理
    let type
    switch (this.data.selectIndex) {
      case 2:
        type = 'kline'
        break
      case 3:
        type = 'k5line'
        break
      case 4:
        type = 'k30line'
        break
    }
    if (this.data.selectIndex == 1) {
      if (this.data.kSettingItem.jhjj == true) {
        this.openjhjj()
      }
      if (this.data.kSettingItem.jhjj == false) {
        this.closejhjj()
      }
      if (this.data.kSettingItem.fsHair) {
        let index = this.data.drawData.data.length - 1
        if (!this.data.kSettingItem.jhjj) {
          index -= 15
        }
        this.setData({
          showCurrentInfo: true
        })
        this.diagram.moveCrosshair(index, true)
      } else {
        this.closeCrosshair()
      }
    }
    // 分时十字光标
    // 日K选项处理
    else if (this.data.selectIndex > 1) {
      if (this.data.kSettingItem.beforeRf == true) {
        this.klines.beforeRf()
        this.volumeLines.beforeRf()
        this.indicator.beforeRf()
      }
      if (this.data.kSettingItem.beforeRf == false) {
        this.klines.cancelRf()
        this.volumeLines.cancelRf()
        this.indicator.beforeRf()
      }
    }
  },

  onLoad: function () {
    socket.createConnect((data) => { })
    EventBus.on('prevtarget', this.prevTarget.bind(this))
    EventBus.on('prevstocktarget', this.prevStockTarget.bind(this))
    EventBus.on('prevlhbtarget', this.prevlhbtarget.bind(this))
    EventBus.on('prevstocklhb', this.prevstocklhb.bind(this))
    EventBus.on('changecurrentInfo', this.changecurrentInfo.bind(this))
    EventBus.on('changekInfo', this.changeKInfo.bind(this))
    EventBus.on('getk133', this.getK133.bind(this))
    EventBus.on('getk141', this.getK141.bind(this))
    EventBus.on('resetPopup', this.resetPopup.bind(this))
    EventBus.on('changeStockAndStockList', this.changeStockAndStockList.bind(this))
    EventBus.on('diagramUnableRight', this.diagramUnableRight.bind(this))
    EventBus.on('diagramUnableLeft', this.diagramUnableLeft.bind(this))
    EventBus.on('resetDiagram', this.resetDiagram.bind(this))
    EventBus.on('closeDiagram', this.closeDiagram.bind(this))
    this.popup = this.selectComponent("#popup")
    this.stockDeal = this.selectComponent("#stockDeal")
    this.diagram = this.selectComponent("#diagram")
    this.klines = this.selectComponent("#klines")
    this.volumeLines = this.selectComponent("#volumeLines")
    this.indicator = this.selectComponent("#indicator")
  },
  isHasStaticData () {
    // if(app.globalData.token && this.data.static105 && this.data.static106 && this.data.static109) {
      this.setData({
        getAllStatic: true
      })
      this.getOtherData()
    // }
  },
  clearData() {
    this.setData({
      kLinesData: {
        data: null
      },
      kLinesDataCurrent: {
        data: null
      },
      agentInfo: {
        data: []
      }
    })
  },
  hasDealAllData() {
    if (this.data.storage) {
      return this.data.storage.hasDealData()
    } else {
      return false
    }
  },
  init(stockInfo) {
    this.setData({
      drawData: {
        data: []
      }
    })
    if (Object.keys(stockInfo).length > 0) {
      this.initTabSelect()
      this.setData({
        stockCode: addZero(stockInfo.code, 6),
        stockInfo: {
          name: stockInfo.stockName,
          stockNo: stockInfo.stockCode
        }
      })
    }
    let data = wx.getStorageSync(
      'globalData' + this.data.stockCode
    )
    if (data !== '') {
      app.globalData = Object.assign({}, app.globalData, data)
    }
  },
  onShow() {
    if (!app.globalData.selectStock) {
      app.globalData.selectStock = wx.getStorageSync('selectStock')
    }
    let stockInfo = app.globalData.selectStock
    if (this.data.stockCode != addZero(stockInfo.code, 6)) {
      this.init(stockInfo)
    }
    this.data.kSettingItem = app.globalData.settingItem
    if (this.data.storage) {
      this.data.storage.clearFile()
    }
    this.setData({
      kSettingItem: this.data.kSettingItem
    })
    this.clearData()
    // 109 为时间数据
    let t109 = wx.getStorageSync('a109000000000000000000000000000').data

    // let t109
    // if(app.globalData.a109 && app.globalData.a109.data) {
    //   t109 = app.globalData.a109.data
    // }

    this.data.t109 = t109
    let newTradeDate
    if (t109) {
      newTradeDate = t109[t109.length - 1]
      this.setData({
        date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2),
        date2: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
      })
    }
    this.closeAllCrosshair()


    let showDeal = wx.getStorageSync('showDeal')
    if (showDeal !== "") {
      this.setData({
        showDeal
      })
    }

    if (this.data.selectIndex > 1) {
      this.klines.initSetting()
    }

    this.setData({
      agentDetail: []
    })
    if (this.data.stockCode[1] === '6') {
      this.setData({
        isStock: false
      })
    } else {
      this.setData({
        isStock: true
      })
    }

    let storage = new WXStorage([{
      type: '106',
      changeCb: (data) => {
        let itemArr = []
        let a106 = data.data
        for (let i = 0; i < a106.length; i++) {
          let cno = a106[i].no
          let temp = {}
          if (a106[i].hasOwnProperty('children')) {
            let children = a106[i].children
            for (let j = 0; j < children.length; j++) {
              temp = Object.assign({}, children[j])
              temp.cno = '' + cno + children[j].cno
              temp.name = a106[i].name
              temp.code = addZero(cno, 3) + addZero(children[j].cno, 3)
              temp.totalName = '' + temp.name + '-' + temp.cname
              itemArr.push(temp)
            }
          }
        }
        let key = addZeroAfter('a106', 31)
        wx.setStorage({ key, data })
        this.setData({
          t106: data,
          itemList: itemArr
        })
        this.data.static106 = true
        this.isHasStaticData()
      },
      createKey: () => {
        let val = this.createKeyStr2(106, '000000', '000000', true)
        return val
      }
    }, {
      type: '105',
      changeCb: (data) => {
        app.globalData.a105 = data
        app.globalData.stockList = data.data
        let key = addZeroAfter('a105', 31)
        this.data.static105 = true
        
        wx.setStorage({ key, data })
        this.isHasStaticData()
      },
      createKey: () => {
        let val = this.createKeyStr(105, '000000', '000000', true)
        return val
      }
    }, {
      type: '109',
      changeCb: (data) => {
        let key = addZeroAfter('a109', 31)
        let newTradeDate = data.data[data.data.length - 1]
        this.data.static109 = true
        
        this.setData({
          date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2),
          date2: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
        })
        wx.setStorage({ key, data })
        this.isHasStaticData()
      },
      createKey: () => {
        let val = this.createKeyStr2(109, '000000', '000000', true, null, '00000000')
        return val
      }
      // isCallMainBack: false
    }], this, () => { })
    
    if (!this.data.isStock) {
      storage.addFile({
        type: '129',
        changeCb: (data) => {
          // 处理成按时间分割的各个项目

          let itemArr = this.data.itemList

          this.setData({
            ydlsData: deal2FiveData(data.data, data.page)
          })

          // this.setData({
          //   k: data
          // })
        },
        createKey: () => {
          let val = this.createKeyStr3(129, '000000', '000000', true, 1, true)
          return val
        }
      })
      storage.addFile({
        type: '128',
        intervalTime: 9000,
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })

          this.setData({
            ydCurrentData: deal2FiveData(data.data)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(128, '000000', '000000', true)
          return val
        }
      })
    } else {
      storage.addFile({
        type: '131',
        intervalTime: 10000,
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })
          this.setData({
            ydStockCurrentData: deal2StockData(data.data)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(131, '000000', this.data.stockCode, true)
          return val
        }
      })
      storage.addFile({
        type: '132',
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })

          this.setData({
            ydStockLsData: deal2StockData(data.data, data.page)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(132, '000000', this.data.stockCode, true, 0, true)
          return val
        }
      })
      storage.addFile({
        type: '142',
        changeCb: (data) => {
          
          this.setData({
            infoLsData: data.data
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(142, '000000', this.data.stockCode, true, 0, true)
          
          return val
        }
      })
    }

    this.data.storage = storage


    this.setView()
    this.data.storage.getFileData()
    wx.onSocketOpen(() => { // 监听WebSocket连接打开事件。
      this.data.storage.getFileData()
      this.isHasStaticData()
      connect((data) => {
        this.data.storage.observeFileChange(data.type, data)
      })
    })
    
    // connect((data) => {
    //   this.data.storage.observeFileChange(data.type, data)
    // })
    // wx.onSocketOpen(() => { // 监听WebSocket连接打开事件。
    //   this.data.storage.getFileData()
    //   connect((data) => {
    //     this.data.storage.observeFileChange(data.type, data)
    //   })
    // })

    this.settingHandler()
    this.initTabSelect()
    if (Object.keys(stockInfo).length > 0) {
      this.getKData()
      this.getSubTableData()
      if (this.data.subSelect == 13) {
        this.getK138({
          detail: stockInfo.code
        })
      }
    }
    // this.setData({
    //   popUpTime: 0
    // })
    // setTimeout(() => {
    //   this.setData({
    //     popUpTime: 1
    //   })
    //   this.popup = this.selectComponent("#popup")
    // }, 5000)
  },
  getSubTableData() {
    let storage = this.data.storage
    storage.deleteFile(128)
    storage.deleteFile(129)
    storage.deleteFile(131)
    storage.deleteFile(132)
    if (!this.data.isStock) {
      this.getK133()
      storage.addFile({
        type: '129',
        changeCb: (data) => {
          // 处理成按时间分割的各个项目

          let itemArr = this.data.itemList

          this.setData({
            ydlsData: deal2FiveData(data.data, data.page)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(129, '000000', '000000', true, 1, true)
          return val
        }
      })
      storage.addFile({
        type: '128',
        intervalTime: 5000,
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })
          
          this.setData({
            ydCurrentData: deal2FiveData(data.data)
          })
        },
        createKey: () => {
          
          let val = this.createKeyStr3(128, '000000', '000000', true)
          return val
        }
      })
    } else {
      storage.addFile({
        type: '131',
        intervalTime: 6000,
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })
          this.setData({
            ydStockCurrentData: deal2StockData(data.data)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(131, '000000', this.data.stockCode, true)
          return val
        }
      })
      storage.addFile({
        type: '132',
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })

          this.setData({
            ydStockLsData: deal2StockData(data.data, data.page)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(132, '000000', this.data.stockCode, true, 0, true)
          return val
        }
      })
    }

  },
  getKData() {
    this.setData({
      kLinesData: {},
      kLinesDataCurrent: {}
    })
    let storage = this.data.storage
    storage.deleteFile(112)
    storage.deleteFile(113)
    storage.deleteFile(114)
    storage.deleteFile(117)
    storage.deleteFile(115)
    storage.deleteFile(116)
    storage.deleteFile(117)
    storage.deleteFile(118)
    storage.deleteFile(119)
    storage.deleteFile(117)
    storage.deleteFile(123)
    storage.deleteFile(124)
    storage.deleteFile(125)
    switch (this.data.selectIndex) {
      case 1:
        this.setData({
          kLinesData: null,
          kLinesDataCurrent: null
        })
        storage.addFile({
          type: '112',
          intervalTime: 10000,
          changeCb: (data) => {
            let averagePrice = 0
            let maxDeal = 0
            let beforeDeal = 0
            let beforeDealN = 0
            let count = 0
            let tempData = Object.assign({}, data)
            
            tempData.data = [].concat(this.data.drawData.data)
            if (tempData.data.length === 0) {
              tempData.data = tempData.data.concat(data.data)
            } else {
              let equalIndex = 0
              for (let i = 0; i < data.data.length; i++) {
                let lastData = tempData.data[tempData.data.length - 1]
                if (parseInt(data.data[i].date) === parseInt(lastData.date)) {
                  equalIndex = i
                  break
                }
              }
              tempData.data[tempData.data.length - 1] = Object.assign({}, data.data[equalIndex])
              tempData.data = tempData.data.concat(data.data.slice(equalIndex + 1))
            }
            let val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              this.data.drawData.data.length)
              
            app.globalData['a' + val.storage] = Object.assign({}, tempData)
            for (let i = 0, length = tempData.data.length; i < length && i < 256; i++) {

              tempData.data[i].dealA = tempData.data[i].da - beforeDeal
              tempData.data[i].dealN = tempData.data[i].dn - beforeDealN
              if (tempData.data[i].dealA >= maxDeal) {
                maxDeal = tempData.data[i].dealA
              }
              beforeDeal = tempData.data[i].da
              beforeDealN = tempData.data[i].dn
              tempData.data[i]
              if (parseInt(tempData.data[i].date) >= 930) {
                averagePrice = (parseFloat(tempData.data[i].dealPrice) + parseFloat(averagePrice))
                count = count + 1
                tempData.data[i].averagePrice = (averagePrice / count).toFixed(2)
                tempData.data[i].averageDa = Math.round((parseFloat(tempData.data[i].da) / count))
              }

            }
            tempData.maxDeal = maxDeal
            this.setData({
              drawData: tempData
            })

            if (!this.data.showCurrentInfo) {
              let lastData = Object.assign({}, tempData.data[tempData.data.length - 1])
              lastData.date = lastData.date.replace(/(\d{2})(\d{2})/, "$1:$2")
              lastData.price = getNumUnit(lastData.price)
              lastData.dealA = getNumUnit(lastData.dealA)
              lastData.dealN = getNumUnit(lastData.dealN)
              lastData.rise = (parseFloat(lastData.dealPrice) - parseFloat(tempData.pcp)) / parseFloat(tempData.pcp) * 100
              lastData.rise = (lastData.rise).toFixed(2)

              this.setData({
                currentInfo: lastData
              })
            }
            
            return tempData
          },
          createKey: () => {
            
            let val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              this.data.drawData.data.length)
              
            if(app.globalData['a' + val.storage]) {
              val = this.createKeyStr112(112, '000000', this.data.stockCode, true,
              app.globalData['a' + val.storage].totalPage)
            }
            
            return val
          }
        })
        break
      case 2:
        this.klines.initSetting()
        storage.addFile({
          type: '113',
          changeCb: (data) => {

            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {

            let val = this.createKeyStr3(113, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '114',
          intervalTime: 10000,
          changeCb: (data) => {
            this.setData({
              kLinesDataCurrent: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(114, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {

            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })

        break

      case 3:
        this.klines.initSetting()
        storage.addFile({
          type: '116',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(116, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '115',
          intervalTime: 10000,
          changeCb: (data) => {
            let kLinesDataCurrent = JSON.parse(JSON.stringify(data))
            kLinesDataCurrent.data = this.data.kLinesDataCurrent.data
            if (kLinesDataCurrent.data) {
              for (let i = 0; i < data.data.length; i++) {
                let flag = true
                for (let j = 0; j < kLinesDataCurrent.data.length; j++) {
                  if (data.data[i].date === kLinesDataCurrent.data[j].date && data.data[i].time === kLinesDataCurrent.data[j].time) {
                    flag = false
                    kLinesDataCurrent.data[j] = data.data[i]
                  }
                }
                if (flag) {
                  kLinesDataCurrent.data.push(data.data[i])
                }
              }
            } else {
              kLinesDataCurrent = data
            }
            this.setData({
              kLinesDataCurrent
            })
            return kLinesDataCurrent
          },
          createKey: () => {
            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(115, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            
            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
      case 4:
        this.klines.initSetting()
        storage.addFile({
          type: '118',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(118, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '119',
          intervalTime: 10000,
          changeCb: (data) => {
            let kLinesDataCurrent = JSON.parse(JSON.stringify(data))
            kLinesDataCurrent.data = this.data.kLinesDataCurrent.data
            if (kLinesDataCurrent.data) {
              for (let i = 0; i < data.data.length; i++) {
                let flag = true
                for (let j = 0; j < kLinesDataCurrent.data.length; j++) {
                  if (data.data[i].date === kLinesDataCurrent.data[j].date && data.data[i].time === kLinesDataCurrent.data[j].time) {
                    flag = false
                    kLinesDataCurrent.data[j] = data.data[i]
                  }
                }
                if (flag) {
                  kLinesDataCurrent.data.push(data.data[i])
                }
              }
            } else {
              kLinesDataCurrent = data
            }
            this.setData({
              kLinesDataCurrent
            })
            return kLinesDataCurrent
          },
          createKey: () => {
            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(119, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '117',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
      case 5:
        this.klines.initSetting()
        storage.addFile({
          type: '123',
          changeCb: (data) => {
            this.setData({
              kLinesData: data
            })
          },
          createKey: () => {
            let val = this.createKeyStr3(123, '000000', this.data.stockCode, true, 0, true)
            return val
          }
        })
        storage.addFile({
          type: '124',
          intervalTime: 10000,
          changeCb: (data) => {
            this.setData({
              kLinesDataCurrent: data
            })
          },
          createKey: () => {
            let page = this.data.kLinesDataCurrent.data ? this.data.kLinesDataCurrent.data.length : null
            let val = this.createKeyStr3(124, '000000', this.data.stockCode, true)
            return val
          }
        })
        storage.addFile({
          type: '125',
          changeCb: (data) => {
            this.setData({
              rfArr: data.data
            })
          },
          createKey: () => {
            let val = this.createKeyStr(125, '000000', this.data.stockCode, true)
            return val
          }
        })
        break
    }
  },
  showPopup() {
    this.data.settingTmp = Object.assign({}, this.data.kSettingItem)
    this.data.settingTmp.ydjx = Object.assign({}, this.data.kSettingItem.ydjx)
    this.data.settingTmp.cbjx = Object.assign({}, this.data.kSettingItem.cbjx)
    this.data.settingTmp.cjljx = Object.assign({}, this.data.kSettingItem.cjljx)

    this.popup.showPopup()
  },
  hide() {
    this.data.storage.clearFile()
  },
  closeCurrentInfo() {
    this.setData({
      showCurrentInfo: false
    })
    this.closeAllCrosshair()
  },
  closeCrosshair() {
    this.setData({
      showCurrentInfo: false
    })
    this.stockDeal.closeCrosshair()
    this.diagram.closeCrosshair()
  },
  setView() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.left-top').boundingClientRect(function (res) {
      res.top
    })
    query.selectViewport().scrollOffset(function (res) {
      res.scrollTop // 显示区域的竖直滚动位置
    })
    const sysInfo = wx.getSystemInfoSync()

    let underViewHeight = sysInfo.windowHeight
    query.exec((res) => {
      let height = res[0].height
      let width = res[0].width - 1

      this.setData({
        diagramHeight: height,
        diagramWidth: width
      })
    })

    query.select('.left-bottom').boundingClientRect(function (res) {
      res.top
    })
    query.selectViewport().scrollOffset(function (res) {
      res.scrollTop // 显示区域的竖直滚动位置
    })
    query.exec((res) => {
      let height = res[2].height
      let width = res[2].width

      this.setData({
        dealHeight: height,
        dealWidth: width
      })
    })
    query.select('.header').boundingClientRect(function (res) {
      res.top
    })
    query.select('.main-view').boundingClientRect(function (res) {
      res.top
    })
    query.exec((res) => {
      underViewHeight = underViewHeight - res[4].height - res[5].height - 51
      this.setData({
        underViewHeight,
      })
    })
  },
  createKeyStr: function (fileType, itemCode, stockCode, isStatic = false, customPage = 0) {
    let page = addZero(this.data.page, 3)
    let dateStr = this.data.date.split('-').join('')
    let sortCode
    if (!isStatic) {
      dateStr = this.data.date.split('-').join('')
      sortCode = this.data.sortCode
    } else {
      page = '000'
      // dateStr = '00000000'
      dateStr = this.data.date.split('-').join('')
      sortCode = '0000'
    }
    if (customPage) {
      page = addZero(customPage, 3)
    }
    let timestamp = ''
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let key2 = '' + fileType + itemCode + '000' + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode] || app.globalData['a' + key2 + sortCode]
    if (kData) {
      timestamp = addZero(kData.timestamp, 10)
    } else {
      for (let i = 0; i < 10; i++) {
        timestamp += '0'
      }
    }
    let value = {
      storage: key + sortCode,
      query: key + timestamp + sortCode
    }
    return value
  },
  createKeyStr112: function (fileType, itemCode, stockCode, isStatic = false, customPage = 0) {
    let page = addZero(this.data.page, 3)
    let dateStr = this.data.date.split('-').join('')
    let sortCode
    if (!isStatic) {
      dateStr = this.data.date.split('-').join('')
      sortCode = this.data.sortCode
    } else {
      page = '000'
      // dateStr = '00000000'
      dateStr = this.data.date.split('-').join('')
      sortCode = '0000'
    }
    if (customPage) {
      page = addZero(customPage, 3)
    }
    let timestamp = ''

    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let key2 = '' + fileType + itemCode + '000' + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode] || app.globalData['a' + key2 + sortCode]
    if (kData) {
      timestamp = addZero(kData.timestamp, 10)
    } else {
      for (let i = 0; i < 10; i++) {
        timestamp += '0'
      }
    }
    let value = {
      storage: key2 + sortCode,
      query: key + timestamp + sortCode
    }
    return value
  },
  createKeyStr2: function (fileType, itemCode, stockCode, isStatic = false, customPage = 0, date, sort) {
    let page = addZero(this.data.page, 3)
    let dateStr = this.data.dateBottom.split('-').join('')
    let sortCode
    if (!isStatic) {
      dateStr = this.data.dateBottom.split('-').join('')
      sortCode = this.data.sortCode
    } else {
      page = '000'
      dateStr = this.data.dateBottom.split('-').join('')
      sortCode = '0000'
    }
    if (date) {
      dateStr = date.split('-').join('')
    }
    if (customPage) {
      page = addZero(customPage, 3)
    }
    if (sort) {
      sortCode = sort
    }
    let timestamp = ''
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let key2 = '' + fileType + itemCode + '000' + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode] || app.globalData['a' + key2 + sortCode]
    if (kData) {
      timestamp = addZero(kData.timestamp, 10)
    } else {
      for (let i = 0; i < 10; i++) {
        timestamp += '0'
      }
    }
    let value = {
      storage: key + sortCode,
      query: key + timestamp + sortCode
    }
    return value
  },
  createMonitorStr: function (fileType, itemCode, stockCode) {
    let page = '000'
    let dateStr = '00000000'
    let sortCode = '0000'
    let timestamp = '0000000000'
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode]
    if (kData) {
      timestamp = addZero(kData.timestamp, 10)
      dateStr = addZero(kData.data[kData.data.length - 1].time.replace(':', ''), 8)
      sortCode = addZero(kData.data[kData.data.length - 1].no, 3) + 0
      stockCode = kData.data[kData.data.length - 1].stockCode
    }
    let value = {
      storage: key + '0000',
      query: '' + fileType + itemCode + page + stockCode + dateStr + timestamp + sortCode
    }
    return value
  },
  createOptionalStockStr: function (fileType, itemCode, stockCode, vn, str) {
    let page = '000'
    let dateStr = '00000000'
    let sortCode = '0000'
    let timestamp = '0000000000'
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode]
    if (kData) {
      // timestamp = addZero(kData.timestamp, 10)
      // dateStr = addZero(kData.data[kData.data.length - 1].time.replace(':', ''), 8).substring(0, 8)
    }
    let value = {
      storage: key + '0000' + vn + str,
      query: '' + fileType + itemCode + page + stockCode + dateStr + timestamp + sortCode + vn + str
    }
    return value
  },
  bindBoost() {
    this.klines.bindBoost()
  },
  bindNarrow() {
    this.klines.bindNarrow()
  },
  resetDiagram() {
    this.setData({
      diagramLeft: true,
      diagramRight: true
    })
  },
  closeDiagram() {
    this.setData({
      diagramLeft: false,
      diagramRight: false
    })
  },
  diagramMoveLeft() {
    
    this.diagram.moveLeft()
  },
  diagramMoveRight() {
    
    this.diagram.moveRight()
  },
  moveLeft() {
    this.klines.moveLeft()
  },
  moveRight() {
    this.klines.moveRight()
  },
  stockUp: throttle(function () {
    this.changeStock(-1)
  }, 0),
  stockDown: throttle(function () {
    this.changeStock(1)
  }, 0),
  changeStockAndStockList(params) {
    let stock = params.stock
    app.globalData.stockList = params.stockList
    if (addZero(stock.code, 6) != this.data.stockCode) {
      this.initData(stock)
    }
  },
  changeStock(direction) {
    if (!this.hasDealAllData() || !this.data.rwLocal) {
      return
    }
    this.setData({
      rwLocal: false
    })
    let index
    let globalData = Object.assign({}, app.globalData)
    let unableKeys = ['a101', 'a108', 'a126', 'a128', 'a129']
    function deleteGlobalData(key) {
      delete globalData[key]
      let key2 = addZeroAfter(key, 31)
      delete globalData[key2]
    }
    // delete globalData.stockList
    // delete globalData.settingItem
    // delete globalData.selectStock
    // deleteGlobalData('a105')
    // deleteGlobalData('a106')
    // deleteGlobalData('a109')

    // deleteGlobalData('a105')
    // deleteGlobalData('a106')
    // deleteGlobalData('a109')
    // deleteGlobalData('settingItem')
    // deleteGlobalData('stockList')
    let keys = Object.keys(app.globalData)
      .filter(key => key.indexOf(this.data.stockCode) < 0 && unableKeys.indexOf(key.slice(0, 4)) < 0)

    for (let i = 0; i < keys.length; i++) {
      deleteGlobalData(keys[i])
    }
    // delete globalData.stockList
    function setStorage(key, value) {
      try {
        wx.setStorageSync(
          key,
          value
        )
      } catch (e) {
        wx.clearStorageSync()
      }
    }
    setStorage('globalData' + this.data.stockCode, globalData)
    // let attrArr = Object.keys(app.globalData)

    // for(let i = 0; i < attrArr.length; i++) {
    //   wx.setStorage({
    //     key: attrArr[i],
    //     data: app.globalData[attrArr[i]]
    //   })
    // }

    let stockList = app.globalData.stockList

    for (let i = 0; i < stockList.length; i++) {
      if (stockList[i].stockCode === this.data.stockInfo.stockNo) {
        index = i
      }
    }
    let nextIndex = (index + direction + stockList.length) % stockList.length
    let currentStock = stockList[nextIndex]
    let data = wx.getStorageSync(
      'globalData' + currentStock.stockCode
    )

    wx.nextTick(() => {
      this.setData({
        rwLocal: true
      })
    })
    if (data !== '') {
      app.globalData = Object.assign({}, app.globalData, data)
    }
    this.initData(currentStock)
    wx.setStorageSync('selectStock', currentStock)
    app.globalData.selectStock = currentStock

    app.globalData.stockCode = currentStock.code
  },
  diagramUnableLeft() {
    this.setData({
      diagramLeft: false
    })
  },
  diagramUnableRight() {
    this.setData({
      diagramRight: false
    })
  },
  initData(stock) {
    let stockInfo = stock
    if (Object.keys(stockInfo).length > 0) {
      this.initTabSelect()
      this.setData({
        stockCode: addZero(stockInfo.code, 6),
        stockInfo: {
          name: stockInfo.stockName,
          stockNo: stockInfo.stockCode
        }
      })
    }
    let data = wx.getStorageSync(
      'globalData' + this.data.stockCode
    )

    if (data !== '') {
      app.globalData = Object.assign({}, app.globalData, data)
    }
    this.clearData()
    this.data.storage.clearFile()



    this.closeAllCrosshair()
    this.setData({
      drawData: {
        data: []
      }
    })
    if (this.data.selectIndex > 1) {
      this.klines.initSetting()
    }
    this.setData({
      agentDetail: []
    })
    if (this.data.stockCode[1] === '6') {
      this.setData({
        isStock: false
      })
    } else {
      this.setData({
        isStock: true
      })
    }
    let storage = new WXStorage([{
      type: '101',
      intervalTime: 15000,
      changeCb: (data) => {
        this.setData({
          t101: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(101, '000000', '000000', true)
        return val
      }
    }, {
      type: '108',
      changeCb: (data) => {
        let stockInfo = {
          current: data.data.current,
          rise: data.data.rise,
          high: data.data.high,
          low: data.data.low,
          close: data.data.close,
          open: data.data.open,
          hand: data.data.hand,
          volume: data.data.volume
        }
        this.setData({
          stockInfo: Object.assign({}, this.data.stockInfo, stockInfo)
        })
      },
      intervalTime: 16000,
      createKey: () => {
        const TYPE = 108
        let val = this.createKeyStr3(108, '000000', this.data.stockCode, true)
        return val
      }
      // isCallMainBack: false
    }, {
      type: '110',
      changeCb: (data) => {
        this.setData({
          agentInfo: data
        })
      },
      intervalTime: 10000,
      createKey: () => {
        let val = this.createKeyStr3(110, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '122',
      intervalTime: 5000,
      changeCb: (data) => {
        for (let j = 0; j < data.data.length; j++) {
          let flag = true
          for (let i = 0; i < this.data.agentDetail.length; i++) {
            if (this.data.agentDetail[i].time == data.data[j].time) {
              this.data.agentDetail[i] = data.data[j]
              flag = false
            }
          }
          if (flag) {
            this.data.agentDetail.push(data.data[j])
          }
        }
        this.setData({
          agentDetail: this.data.agentDetail,
          stockPcp: data.pcp
        })
        data.data = this.data.agentDetail
        return data
      },
      createKey: () => {
        let val = this.createKeyStr(122, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '117',
      changeCb: (data) => {
        this.setData({
          rfArr: data.data
        })
      },
      createKey: () => {

        let val = this.createKeyStr(117, '000000', this.data.stockCode, true)
        return val
      }
    }, {
      type: '104',
      changeCb: (data) => {
        this.setData({
          stockDetailData: data
        })
        wx.setStorageSync('page104' + addZero(this.data.stockCode, 6), data.totalPage)
      },
      createKey: () => {
        let val = this.createKeyStr3(104, '000000', this.data.stockCode, true, 0, true)
        return val
      }
    }, {
      type: '126',
      intervalTime: 10000,
      changeCb: (data) => {
        // let oldData = wx.getStorageSync('k126000000000000000000000000000')
        let oldData = {
          data: []
        }
        if (this.data.t126) {
          oldData = this.data.t126
        }
        for (let i = 0; i < data.data.length; i++) {
          let flag = true
          for (let j = 0; j < oldData.data.length; j++) {
            if (data.data[i].no == oldData.data[j].no && data.data[i].stockCode == oldData.data[j].stockCode && data.data[i].time == oldData.data[j].time && data.data[i].value == oldData.data[j].value) {
              oldData.data[j] = data.data[i]
              flag = false
            }
          }
          if (flag) {
            oldData.data.push(data.data[i])
          }
        }
        data.data = oldData.data.slice(-50)
        this.setData({
          t126: data
        })
        return data
      },
      createKey: () => {
        let val = this.createMonitorStr(126, '000000', '000000')
        return val
      }
    }], this, () => { })
    if (!this.data.isStock) {
      storage.addFile({
        type: '129',
        changeCb: (data) => {
          // 处理成按时间分割的各个项目
          this.setData({
            ydlsData: deal2FiveData(data.data, data.page)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(129, '000000', this.data.stockCode, true, 1, true)
          return val
        }
      })
      storage.addFile({
        type: '128',
        intervalTime: 11000,
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          this.setData({
            ydCurrentData: deal2FiveData(data.data)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(128, '000000', this.data.stockCode, true)
          return val
        }
      })
    } else {
      storage.addFile({
        type: '131',
        intervalTime: 12000,
        changeCb: (data) => {
          this.setData({
            ydStockCurrentData: deal2StockData(data.data)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(131, '000000', this.data.stockCode, true)
          return val
        }
      })
      storage.addFile({
        type: '132',
        changeCb: (data) => {
          // 处理成当天项目，并传一个标识过去
          // this.setData({
          //   kLinesDataCurrent: data
          // })

          this.setData({
            ydStockLsData: deal2StockData(data.data, data.page)
          })
        },
        createKey: () => {
          let val = this.createKeyStr3(132, '000000', this.data.stockCode, true, 0, true)
          return val
        }
      })
    }

    this.setData({
      storage
    })


    this.setView()
    this.data.storage.getFileData()
    connect((data) => {
      this.data.storage.observeFileChange(data.type, data)
    })
    wx.onSocketOpen(() => { // 监听WebSocket连接打开事件。
      this.data.storage.getFileData()
      connect((data) => {
        this.data.storage.observeFileChange(data.type, data)
      })
    })

    this.settingHandler()
    this.initTabSelect()
    if (Object.keys(stockInfo).length > 0) {
      this.getKData()
      this.getSubTableData()
      if (this.data.subSelect == 13) {
        this.getK138({
          detail: stockInfo.code
        })
      }
    }
    // this.setData({
    //   popUpTime: 0
    // })
    // setTimeout(() => {
    //   this.setData({
    //     popUpTime: 1
    //   })
    //   this.popup = this.selectComponent("#popup")
    // }, 5000)
  },
  createKeyStr3: function (fileType, itemCode, stockCode, isStatic = false, customPage = 0, isReverse = false) {
    let page = addZero(this.data.page, 3)
    let dateStr = this.data.date.split('-').join('')
    let sortCode
    if (!isStatic) {
      dateStr = this.data.date.split('-').join('')
      sortCode = this.data.sortCode
    } else {
      page = '000'
      dateStr = '00000000'
      // dateStr = this.data.date.split('-').join('')
      sortCode = '0000'
    }

    if (customPage) {
      page = addZero(customPage, 3)
    }

    if (isStatic && isReverse) {

      let pageTable = app.globalData['pageTable' + this.data.stockCode]
      if (pageTable) {
        if (pageTable[fileType]) {
          page = pageTable[fileType]
        }
      }
    }
    let timestamp = ''
    let key = '' + fileType + itemCode + page + stockCode + dateStr
    let key2 = '' + fileType + itemCode + '000' + stockCode + dateStr
    let kData = app.globalData['a' + key + sortCode] || app.globalData['a' + key2 + sortCode]
    if (kData) {
      timestamp = addZero(kData.timestamp, 10)
    } else {
      for (let i = 0; i < 10; i++) {
        timestamp += '0'
      }
    }
    let value = {
      storage: key + sortCode,
      query: key + timestamp + sortCode
    }
    if (fileType === 132) {

    }

    if (kData && isReverse) {

      value.query = key + addZero(kData.data.length, 10) + sortCode
    }
    return value
  },
  prevTarget(page) {
    if (isNaN(page) || page <= 0) {
      return
    }
    let key = this.createKeyStr3(129, '000000', this.data.stockCode, true, page)
    this.data.storage.getData(key)
  },
  prevStockTarget(page) {
    if (isNaN(page) || page <= 0) {
      return
    }
    let key = this.createKeyStr3(132, '000000', this.data.stockCode, true, page)
    this.data.storage.getData(key)
  },
  prevlhbtarget(page) {
    let key = this.createKeyStr3(133, '000000', '000000', true, page)
    this.data.storage.getData(key)
  },
  prevstocklhb(page) {

    let key = this.createKeyStr3(141, '000000', this.data.stockCode, true, page)
    this.data.storage.getData(key)
  },
  getPrevKData(e) {
    if (this.data.selectIndex == 2) {
      let key = this.createKeyStr(113, '000000', this.data.stockCode, true, e.detail)
      this.data.storage.getData(key)
    } else if (this.data.selectIndex == 3) {
      let key = this.createKeyStr(116, '000000', this.data.stockCode, true, e.detail)
      this.data.storage.getData(key)
    } else if (this.data.selectIndex == 4) {
      let key = this.createKeyStr(118, '000000', this.data.stockCode, true, e.detail)
      this.data.storage.getData(key)
    } else if (this.data.selectIndex == 5) {
      let key = this.createKeyStr(123, '000000', this.data.stockCode, true, e.detail)
      this.data.storage.getData(key)
    }

  },
  onHide() {
    this.data.storage.clearFile()
  },
  dateChange(e) {
    this.setData({
      dateBottom: e.detail,
      t101: null,
      t106: null,
      t102: null
    })
    let storage = this.data.storage
    storage.deleteFile(101)
    storage.addFile({
      type: '101',
      intervalTime: 6000,
      changeCb: (data) => {
        this.setData({
          t101: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(101, '000000', '000000', true)
        return val
      }
    })
    storage.addFile({
      type: '106',
      changeCb: (data) => {
        this.setData({
          t106: data
        })

        let key = addZeroAfter('a106', 31)
        wx.setStorage({ key, data })
      },
      createKey: () => {
        let val = this.createKeyStr2(106, '000000', '000000', true)
        return val
      }
    })
  },
  closeGetChild() {
    let storage = this.data.storage
    storage.deleteFile(102)
  },
  getT102(no) {
    let storage = this.data.storage
    storage.deleteFile(102)
    storage.addFile({
      type: '102',
      intervalTime: 14000,
      changeCb: (data) => {
        this.setData({
          t102: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(102, '00' + no.detail + '000', '000000', true)
        return val
      }
    })
  },
  getNewStockDetail(e) {
    let page = e.detail
    let storage = this.data.storage
    storage.deleteFile(104)
    storage.addFile({
      type: '104',
      changeCb: (data) => {
        this.setData({
          t102: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(104, '000000', '000000', true, page)
        return val
      }
    })
  },
  resetPopup() {
    // clearTimeout(this.data.popUpTimeOut)
    // this.setData({
    //   popUpTime: 0
    // })
    // this.data.popUpTimeOut = setTimeout(() => {
    //   this.data.time++
    //   this.setData({
    //     popUpTime: 1
    //   })
    //   this.popup = this.selectComponent("#popup")
    // }, 500)
  },
  changeSubSelect(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      subSelect: index
    })
    if (index === 3 || index === 6) {
      this.resetPopup()
    }
  },
  changeSideSelect(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      sideSelect: index
    })
  },
  getBestSelect(e) {
    let params = e.detail
    let storage = this.data.storage
    storage.deleteFile(121)
    storage.addFile({
      type: '121',
      changeCb: (data) => {
        this.setData({
          bestSelectData: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(121, addZero(params.no, 3) + addZero(params.cno, 3), '000000', true, null, params.date)
        return val
      }
    })
  },
  getK103(e) {
    let storage = this.data.storage
    storage.deleteFile(103)
    storage.addFile({
      type: '103',
      intervalTime: 7000,
      changeCb: (data) => {
        this.setData({
          t103: data
        })
      },
      createKey: () => {
        let page = 1
        if (e.detail.page) {
          page = e.detail.page
        }
        let sort = '0000'
        if (e.detail.sort) {
          sort = e.detail.sort
        }
        let val = this.createKeyStr2(103, e.detail.code, '000000', true, page, null, sort)
        return val
      }
    })
  },
  stopGetK103() {
    let storage = this.data.storage
    storage.deleteFile(103)
  },
  getMorek127(e) {
    let storage = this.data.storage
    storage.deleteFile(127)
    if (e.detail.closeK126) {
      storage.deleteFile(126)
    }
    storage.addFile({
      type: '127',
      changeCb: (data) => {
        this.setData({
          t127: data
        })
      },
      createKey: () => {
        let page
        if (e.detail.currentPage) {
          page = e.detail.currentPage
        }
        let val = this.createKeyStr2(127, '000000', '000000', true, page, '00000000')
        return val
      }
    })
  },
  getK126() {
    let storage = this.data.storage
    storage.deleteFile(126)
    storage.addFile({
      type: '126',
      intervalTime: 13000,
      changeCb: (data) => {

        this.setData({
          t126: data
        })
      },
      createKey: () => {
        let val = this.createMonitorStr(126, '000000', '000000')
        return val
      }
    })
  },
  getK120(e) {
    let storage = this.data.storage
    storage.deleteFile(120)
    storage.addFile({
      type: '120',
      changeCb: (data) => {
        this.setData({
          t120: data
        })
      },
      createKey: () => {
        let page
        if (e.detail.currentPage) {
          page = e.detail.currentPage
        }
        let val = this.createKeyStr2(120, addZero(e.detail.itemCode, 3) + addZero(e.detail.itemCode2, 3), '000000', true, page, e.detail.date)
        return val
      }
    })
  },
  bottomTabChange(e) {
    this.setData({
      bottomIndex: e.currentTarget.dataset.index
    })
    this.initTabSelect()
  },
  initTabSelect() {
    if (this.data.selectIndex == 1) {
      if (this.data.bottomIndex == 1) {
        if (this.data.isStock) {
          this.setData({
            subSelect: 4
          })
        } else {
          this.setData({
            subSelect: 1
          })
        }
      } else {
        if (this.data.isStock) {
          this.setData({
            subSelect: 13
          })
        } else {
          this.setData({
            subSelect: 11
          })

        }
      }
    } else {
      if (this.data.bottomIndex == 1) {
        if (this.data.isStock) {
          this.setData({
            subSelect: 3
          })
        } else {

          this.setData({
            subSelect: 6
          })
        }
      } else {
        if (this.data.isStock) {
          this.setData({
            subSelect: 14
          })
        } else {
          this.setData({
            subSelect: 12
          })
        }
      }
    }
    if (this.data.bottomIndex == 6) {
      this.setData({
        subSelect: 16
      })
    }
  },
  getK134(e) {
    let storage = this.data.storage
    storage.deleteFile(134)
    storage.addFile({
      type: '134',
      changeCb: (data) => {

        this.setData({
          t134: data
        })
      },
      createKey: () => {

        let val = this.createKeyStr2(134, '000000', '000000', true, null, e.detail.date)
        return val
      }
    })
  },
  getK136(e) {
    let storage = this.data.storage
    storage.deleteFile(136)
    storage.addFile({
      type: '136',
      changeCb: (data) => {

        this.setData({
          t136: data
        })
      },
      createKey: () => {

        let val = this.createKeyStr2(136, '000000', '000000', true, null, e.detail.date)
        return val
      }
    })
  },
  getK137(e) {
    let storage = this.data.storage
    storage.deleteFile(137)
    storage.addFile({
      type: '137',
      changeCb: (data) => {
        this.setData({
          t137: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(137, '000000', addZero(e.detail.code, 6), true, null, e.detail.date)
        return val
      }
    })
  },
  getK141(e) {
    let storage = this.data.storage
    storage.deleteFile(141)
    storage.addFile({
      type: '141',
      changeCb: (data) => {
        let realData = deal2SixPart2(data.data, data.page)
        this.setData({
          t141: realData
        })
      },
      createKey: () => {
        let val = this.createKeyStr3(141, '000000', this.data.stockCode, true, 0, true)
        return val
      }
    })
  },
  getK133(e) {

    let storage = this.data.storage
    storage.deleteFile(133)
    storage.addFile({
      type: '133',
      changeCb: (data) => {

        let realData = deal2SixPart(data.data, data.page)

        this.setData({
          t133: realData
        })
      },
      createKey: () => {

        let val = this.createKeyStr3(133, '000000', '000000', true, 0, true)
        return val
      }
    })
  },
  getK138(e) {
    let storage = this.data.storage
    storage.addFile({
      type: '138',
      changeCb: (data) => {
        this.setData({
          t138: data
        })
      },
      createKey: () => {
        let val = this.createKeyStr2(138, '000000', e.detail ? e.detail : this.data.stockCode, true)
        return val
      }
    })
  },
  tabUse(e) {
    this.setData({
      tabCanClick: e.detail
    })
  },
  getK139(e) {
    let storage = this.data.storage
    storage.addFile({
      type: '139',
      changeCb: (data) => {

        this.setData({
          t139: data
        })
      },
      createKey: () => {

        let val = this.createKeyStr2(139, '000000', this.data.stockCode, true, null, e.detail.date)
        return val
      }
    })
  },
  toSetting() {
    let type = 1
    if (this.data.selectIndex > 1) {
      type = 2
    }
    wx.navigateTo({
      url: '../setting/setting?type=' + type
    })
  },
  getK107(e) {
    let storage = this.data.storage
    storage.deleteFile(107)
    storage.addFile({
      type: '107',
      intervalTime: 10000,
      changeCb: (data) => {
        this.setData({
          t107: data
        })
      },
      createKey: () => {
        let val = this.createOptionalStockStr(107, '000000', '000000', e.detail.id, e.detail.codeStr)
        return val
      }
    })
  }
})
