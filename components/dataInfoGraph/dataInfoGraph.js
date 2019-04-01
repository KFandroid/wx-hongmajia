// components/targetGraph/targetGraph.js
import EventBus from '../../utils/pubsub.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'
function dealTmpData(tempData, index) {
  let data = []
  for(let i = 0; i < tempData.length; i++) {
    let temp = {}
    temp.mode = tempData[i].mode
    temp.data = tempData[i].data
    temp.info = tempData[i].info
    temp.minNum = Infinity
    temp.maxNum = -Infinity
    if(temp.mode === 'updown' || temp.mode === 'supdown') {
      temp.data.forEach(element => {
        
        if(element['y1']> temp.maxNum) {
          temp.maxNum = parseFloat(element['y1'])
        }
        if(element['y2'] < temp.minNum) {
          temp.minNum = parseFloat(element['y2'])
        }
      })
      if(temp.maxNum > Math.abs(temp.minNum)) {
        temp.minNum = -temp.maxNum
      }  else {
        temp.maxNum = -temp.minNum
      }
    } else if(temp.mode === 'normal') {
      temp.minNum = 0
      temp.data = temp.data.map(element => {
        if(parseFloat(element['y'])> temp.maxNum) {
          temp.maxNum = parseFloat(element['y'])
        }
        return Object.assign({}, element, {
          y1: element.y,
          y2: ''
        })
      })
    }
    if(index === -1 || index >= temp.data.length) {
      index = temp.data.length - 1
    }
    
    if(temp.data.length) {
      temp.currentInfo = Object.assign({}, temp.data[index]) 
      temp.currentInfo.y1 = getNumUnit(temp.currentInfo.y1)
    }
    data.push(temp)
  }
  return data
}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    barGraphHeight: {
      type: Number,
      value: 60,
    },
    height: {
      type: Number,
      value: 300,
      observer(newData){
        let graphCount = Math.floor(newData / (60 + 19))
        if(graphCount > 4) {
          graphCount = 4
        }
        this.data.graphCount = graphCount
        let settingItems = this.data.settingItems
        let allCount = this.data.allCount = this.data.graphXCount * graphCount
        for(let i = 0; i < allCount && i < settingItems.length; i++) {
          settingItems[i].checked = true
        }
        this.setData({
          settingItems
        })
        this.processData()
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        
        let graphXCount = Math.floor(newData / 250)
        if(graphXCount === 0) {
          graphXCount = 1
        }
        this.data.graphXCount = graphXCount
        let settingItems = this.data.settingItems
        let allCount = this.data.allCount = graphXCount * this.data.graphCount
        for(let i = 0; i < allCount && i < settingItems.length; i++) {
          settingItems[i].checked = true
        }
        let barGraphWidth = (newData- (graphXCount - 1) * 10)/ graphXCount
        this.setData({
          settingItems,
          graphXCount,
          barGraphWidth,
        })
        this.processData()
      }
    },
    lsData: {
      type: Array,
      value: [],
      observer(newData) {
        
        this.data.currentPage = parseInt(newData.page)
        if(Object.keys(newData).length === 0) {
          return 
        }
        if(newData.length) {
          this.processData()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sizeType: [{
      width: 1,
      interval: 1
    }, {
      width: 3,
      interval: 1
    }, {
      width: 5,
      interval: 1
    }, {
      width: 9,
      interval: 1
    }, {
      width: 15,
      interval: 2
    }, {
      width: 23,
      interval: 2
    }, {
      width: 35,
      interval: 3
    }, {
      width: 55,
      interval: 3
    }],
    showData: [],
    popUpTime: 0,
    popUpTimeOut: null,
    showError: false,
    graphCount: 4,
    graphXCount: 1,
    barGraphWidth: 240,
    index: -1,
    showSetting: false,
    rectWidth: 5,
    rectInterval: 1,
    settingItems: [{
      name: 'mgjlr', //净利润
      key: 'mgjlr',
      checked: false,
      value: '每股净利润'
    }, {
      name: 'kzrcg', 
      key: 'kzrcg',
      checked: false,
      value: '控制人持股'
    }, {
      name: 'zfz', 
      key: 'zfz',
      checked: false,
      value: '总负债'
    }, {
      name: 'mgxjl', //现金流
      key: 'mgxjl',
      checked: false,
      value: '每股现金流'
    }, {
      name: 'mggjj',
      key: 'mggjj',
      checked: false,
      value: '每股公积金'
    }, {
      name: 'mgwfp',
      key: 'mgwfp',
      checked: false,
      value: '每股未分配'
    }, {
      name: 'yyzsr',
      key: 'yyzsr',
      value: '营业总收入'
    }, {
      name: 'cqfz',
      key: 'cqfz',
      value: '长期负债'
    }, {
      name: 'ldfz',
      key: 'ldfz',
      value: '流动负债'
    }, {
      name: 'ltag',
      key: 'ltag',
      value: '流通A股'
    }, {
      name: 'wfplr',
      key: 'wfplr',
      value: '未分配利润'
    }, {
      name: 'zgb',
      key: 'zgb',
      value: '总股本'
    }, {
      name: 'zzc',
      key: 'zzc',
      value: '总资产'
    }],
    historyData: {
      mgjlr: [], // 净利润
      mgxjl: [], // 现金流
      kzrcg: [],
      zgb: [],
      ldfz: [],
      zfz: [],
      zzc: [],
      ltag: [],
      wfplr: [],
      mggjj: [], // 每股公积金
      mgwfp: [], // 每股未分配
      yyzsr: [], // 营业总收入
      cqfz: [] // 长期负债
    },
    t: '',
    kDateArr: [],
    kDate: null,
    sortKey: ['mgjlr', 'kzrcg', 'zfz', 'zgb', 'zzc',
     'ldfz', 'ltag', 'wfplr', 'mgxjl', 'mggjj', 'mgwfp', 'yyzsr', 'cqfz'],
  },
  attached() {
    EventBus.on('movecrosshair.data', this.moveCrosshair.bind(this))
    EventBus.on('changekdate', this.changekDate.bind(this))
    let kDate = app.globalData.kDate
      let kDateArr = app.globalData.kDate
      this.data.kDate = kDate
      this.data.kDateArr = kDateArr
    let itemSetting = wx.getStorageSync('zlSettingItem')
    if(itemSetting) {
      this.setData({
        settingItems: itemSetting
      })
      this.data.settingItems = itemSetting
      let settingItems = [].concat(this.data.settingItems)
      let isSetting = []
      settingItems.forEach((item) => {
        if (item.checked) {
          isSetting.push(item.key)
        }
      })
      this.data.sortKey = isSetting
      this.data.lastSetting = settingItems
      this.data.isSetting = isSetting
      
      this.processData()
    }
      
  
    
  },
  /**
   * 组件的方法列表
   */
  pageLifetimes: {
    show(){
      
    }
  },
  methods: {
    changekDate(kDate) {
      this.data.kDate = kDate
      this.data.kDateArr = kDate.dateArr
      this.processData()
    },
    checkItem(e) {

      let index = e.currentTarget.dataset.index
      
      let settingItems = [].concat(this.data.settingItems)
      let isSetting = []
      settingItems.forEach((item) => {
        if (item.checked) {
          isSetting.push(item.key)
        }
      })
      settingItems[index].checked = !settingItems[index].checked
      let selectKey = settingItems[index].key
      
      if(settingItems[index].checked) {
        isSetting.unshift(settingItems[index].key)
      } else {
        let index = isSetting.indexOf(selectKey)
        isSetting.splice(index, 1)
      }
      
      
      if(isSetting.length > this.data.graphCount) {
        settingItems[index].checked = false
        this.setData({
          showError: true
        })
        return
      } else {
        this.setData({
          showError: false
        })
      }
      this.setData({
        isSetting,
        lastSetting: settingItems,
        settingItems
      })
    },
    settingDialogNo() {
      this.popup.hidePopup()
      this.data.showSetting = false

    },
    settingDialogYes() {
      this.setData({
        sortKey: this.data.isSetting,
        settingItems: this.data.lastSetting
      })
      wx.setStorage({
        key: 'zlSettingItem',
        data: this.data.settingItems
      })
      this.processData()
      this.data.showSetting = false
      this.popup.hidePopup()
      
    },
    initSetting() {
      let sizeLevel = app.globalData.kSizeLevel
      
      if (sizeLevel || sizeLevel === 0) {
        this.setData({
          sizeLevel
        })
      }
    },
    openSetting() {
      this.data.showSetting = true
      this.popup = this.selectComponent("#popup")
      
      this.popup.showPopup()
    },
    moveCrosshair(crosshairPosition) {
      
      let index = Math.floor(crosshairPosition.x / (this.data.rectInterval + this.data.rectWidth))
      // if(index > (this.data.historyData['qk'].length + this.data.currentData['qk'].length)) {
      //   return
      // }
      
      let showCount = Math.floor(this.data.barGraphWidth/(this.data.rectInterval + this.data.rectWidth))
      let allDataLength = this.data.showData[0].data.length
      let leftLength = showCount - allDataLength
      this.data.index = index - leftLength
      
      this.processData()
    },
    processData() {
      
      if(!this.data.showSetting) {
        clearTimeout(this.data.popUpTimeOut)
        this.setData({
          popUpTime: 0
        })
        this.data.popUpTimeOut = setTimeout(() => {
        this.setData({
          popUpTime: 1
        })
        this.popup = this.selectComponent("#popup")
      }, 1000)
      }
      let graphCount = this.data.graphCount
      let barGraphHeight = (this.data.height - graphCount * 19 - 16)/ graphCount
      
      this.setData({
        barGraphHeight,
        graphCount
      })
      let allData = {
        mgjlr: {
          mode: "supdown",
          info: {
            title:'每股净利润',
            title1:'',
            title2: ''
          },
          data: []
        }, // 缺口
        kzrcg: {
          mode: "normal",
          info: {
            title:'控制人持股',
            title1:'',
            title2: ''
          },
          data: []
        }, // 控制人持股
        zfz: {
          mode: "normal",
          info: {
            title:'总负债',
            title1:'',
            title2: ''
          },
          data: []
        }, 
        zzc: {
          mode: "normal",
          info: {
            title:'总资产',
            title1:'',
            title2: ''
          },
          data: []
        }, 
        ldfz: {
          mode: "normal",
          info: {
            title:'流动负债',
            title1:'',
            title2: ''
          },
          data: []
        }, // 控制人持股
        ltag: {
          mode: "normal",
          info: {
            title:'流通A股',
            title1:'',
            title2: ''
          },
          data: []
        }, // 控制人持股
        wfplr: {
          mode: "normal",
          info: {
            title:'未分配利润',
            title1:'',
            title2: ''
          },
          data: []
        },
        mgxjl: {
          mode: "normal",
          info: {
            title: '每股现金流',
            title1: '',
            title2: ''
          },
          data: []
        }, // 涨跌
        mggjj: {
          mode: "updown",
          info: {
            title: '每股公积金',
            title1: '',
            title2: ''
          },
          data: []
        }, // 竞价
        mgwfp: {
          mode: "normal",
          info: {
            title: '每股未分配',
            title1: '',
            title2: ''
          },
          data: []
        }, // 开盘
        cqfz: {
          mode: "normal",
          info: {
            title: '长期负债',
            title1: '',
            title2: ''
          },
          data: []
        }, // 开盘
        yyzsr: {
          mode: "supdown",
          info: {
            title: '营业总收入',
            title1: '',
            title2: ''
          },
          data: []
        }, // 尾盘
        zgb: {
          mode: "normal",
          info: {
            title: '总股本',
            title1: '',
            title2: ''
          },
          data: []
        }
      }
      
      let sortKey = this.data.sortKey   
      let showCount = Math.floor(this.data.barGraphWidth/ (this.data.rectInterval + this.data.rectWidth))
      let end = this.data.lsData.length - showCount
      if(end < 0) {
        end = 0
      }    
      let data = this.data.lsData.slice(end, this.data.lsData.length)    
      let keys = Object.keys(allData)
      function calAnnual(t, value) {
        let month = parseInt(t.slice(5, 7))
        
        return value/month*12
      }
      for(let i = 0; i < data.length; i++) {
        let tempData = data[i]
        
        for(let j = 0; j < keys.length; j++) {
          let key = keys[j]
          if(allData[key].mode === 'supdown') {
            allData[key].data.push({
              t: tempData.t,
              y1: tempData[key],
              y2: calAnnual(tempData.t, tempData[key])
            })
          } else if(allData[key].mode === 'updown') {
            if(tempData[key] > 0 ) {
              allData[key].data.push({
                t: tempData.t,
                y1: tempData[key],
                y2: 0
              })
            } else {
              allData[key].data.push({
                t: tempData.t,
                y1: 0,
                y2: tempData[key]
              })
            }
            
          } else {
            allData[key].data.push({
              t: tempData.t,
              y: tempData[key]
            })
          }
          
        }
      }
      let showData = []
      for(let i = 0; i < sortKey.length; i++) {
        showData.push(allData[sortKey[i]])
      }
      
      showData = dealTmpData(showData, this.data.index)
      
      let tempData = showData.slice(0, graphCount)
      const tmplData = {
            maxNum:0,
            info: {
              title: '',
              title1: '',
              title2: ''
            },
            selectData: '',
            mode: 'normal',
            data: []
          }
          for(let i = tempData.length; i < graphCount; i++) {
            tempData.push(tmplData)
          }
          
          this.setData({
            showData: tempData
          })
          
    }
  }
})
