// components/targetGraph/targetGraph.js
import EventBus from '../../utils/pubsub.js'
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
      temp.currentInfo = temp.data[index]
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
      value: [
        {t: '2017-03-31', gjj: '10', xjl: '12', jlr: '12', wfp: '19', zsr: '51'},
        {t: '2017-06-30', gjj: '10', xjl: '12', jlr: '22', wfp: '19', zsr: '51'},
        {t: '2017-09-30', gjj: '10', xjl: '12', jlr: '42', wfp: '19', zsr: '51'},
        {t: '2017-12-31', gjj: '10', xjl: '12', jlr: '52', wfp: '19', zsr: '51'},
        {t: '2018-03-31', gjj: '10', xjl: '12', jlr: '2', wfp: '19', zsr: '51'},
        {t: '2018-06-30', gjj: '10', xjl: '12', jlr: '32', wfp: '19', zsr: '51'},
        {t: '2018-09-30', gjj: '10', xjl: '12', jlr: '32', wfp: '19', zsr: '51'},
        {t: '2018-12-31', gjj: '10', xjl: '12', jlr: '32', wfp: '19', zsr: '51'},
        {t: '2019-01-31', gjj: '10', xjl: '12', jlr: '32', wfp: '19', zsr: '51'},
        {t: '2019-03-31', gjj: '10', xjl: '12', jlr: '32', wfp: '19', zsr: '51'}
      ],
      observer(newData) {
        
        this.data.currentPage = parseInt(newData.page)
        if(Object.keys(newData).length === 0) {
          return 
        }
        if(newData.gjj.length) {
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
    rectWidth: 9,
    rectInterval: 3,
    settingItems: [{
      name: 'jlr', //净利润
      key: 'jlr',
      checked: false,
      value: '每股净利润'
    }, {
      name: 'xjl', //现金流
      key: 'xjl',
      checked: false,
      value: '每股现金流'
    }, {
      name: 'gjj',
      key: 'gjj',
      checked: false,
      value: '每股公积金'
    }, {
      name: 'wfp',
      key: 'wfp',
      checked: false,
      value: '每股未分配'
    }, {
      name: 'zsr',
      key: 'zsr',
      value: '营业总收入'
    }],
    historyData: {
      jlr: [], // 净利润
      xjl: [], // 现金流
      gjj: [], // 每股公积金
      wfp: [], // 每股未分配
      zsr: [], // 营业总收入
    },
    t: '',
    kDateArr: [],
    kDate: null,
    sortKey: ['jlr', 'xjl', 'gjj', 'wfp', 'zsr'],
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
        jlr: {
          mode: "supdown",
          info: {
            title:'每股净利润',
            title1:'',
            title2: ''
          },
          data: []
        }, // 缺口
        xjl: {
          mode: "normal",
          info: {
            title: '每股现金流',
            title1: '',
            title2: ''
          },
          data: []
        }, // 涨跌
        gjj: {
          mode: "normal",
          info: {
            title: '每股公积金',
            title1: '',
            title2: ''
          },
          data: []
        }, // 竞价
        wfp: {
          mode: "normal",
          info: {
            title: '每股未分配',
            title1: '',
            title2: ''
          },
          data: []
        }, // 开盘
        zsr: {
          mode: "normal",
          info: {
            title: '营业总收入',
            title1: '',
            title2: ''
          },
          data: []
        }, // 尾盘
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
