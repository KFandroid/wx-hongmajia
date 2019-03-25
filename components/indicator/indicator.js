// components/targetGraph/targetGraph.js
import EventBus from '../../utils/pubsub.js'
import {
  calculateKDJ,
  calculateBoll,
  calculateBiasIndicators,
  calculateWR,
  calculateRelativeStrength
} from '../../utils/calculateIndicator.js'

const calculate = {
  kdj: calculateKDJ,
  boll: calculateBoll,
  bias: calculateBiasIndicators,
  wr: calculateWR,
  rsi: calculateRelativeStrength
}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: {
      type: Number,
      value: null,
      observer(index) {
        let type
        switch (index) {
          case 2:
            type = 'kline'
            break
          case 3:
            type = 'k5line'
            break
          case 4:
            type = 'k30line'
            break
          case 5:
            type = 'kweekline'
            break
        }
        this.data.key = type
      }
    },
    bottomIndex: {
      type: Number,
      value: null,
      observer(index) {
        
        if(index === 7) {
          this.processData()
        }
      }
    },
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
        // let settingItems = this.data.settingItems
        // for(let i = 0; i < graphCount; i++) {
        //   settingItems[i].checked = true
        // }
        // this.setData({
        //   settingItems
        // })
      if(this.data.bottomIndex === 7) {
        this.processData()
      }
          
        
        
        // this.setData({
        //   graphCount
        // })
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        
      }
    },
    start: {
      type: Number,
      value: 0,
      observer(newData) {
        if (this.data.bottomIndex === 7 && newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          
        }
      }
    },
    end: {
      type: Number,
      value: 0,
      observer(newData) {
        if (this.data.bottomIndex === 7 && newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          
        }
      }
    },
    rectWidth: {
      type: Number,
      value: 1,
      observer(newData) {
        if (this.data.bottomIndex === 7 && newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          
        }
      }
    },
    rectInterval: {
      type: Number,
      value: 1,
      observer(newData) {
        if (this.data.bottomIndex === 7 && newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          
        }
      }
    },
    
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        if (this.data.bottomIndex === 7 && newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          
        }
      }
    },
    kLinesData: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        
        if (newData && newData.data) {
          if (oldData.data && oldData.page !== newData.page && this.data.firstInit) {

            newData.data = newData.data.concat(oldData.data)
          }
          this.data.firstInit = true


          if (oldData.page !== newData.page) {
            this.setData({
              data: {
                rf: newData.data
              },
              count: 0,
              newCount: 0
            })
            // if (oldData.data && oldData.page !== newData.page) {
            if (this.data.bottomIndex === 7 && newData.data) {
              this.processData()
              
            }
          }

          // }
        }
      }
    },
    kLinesDataCurrent: {
      type: Object,
      value: {},
      observer(newData) {
        
        if (newData && this.data.data.rf && newData.data) {
          if (this.data.selectIndex > 2 && this.data.selectIndex != 5) { //5 是周K
            for (let i = 0; i < newData.data.length; i++) {
              let flag = true
              for (let j = 0; j < this.data.data.rf.length; j++) {

                if (this.data.data.rf[j].date == newData.data[i].date) {
                  this.data.data.rf[j] = newData.data[i]
                  // this.data.data.rf[j].date = newData.data[i].date + ' ' + newData.data[i].time
                  flag = false
                }

              }
              if (flag) {
                this.data.data.rf.push(newData.data[i])
                this.data.data.rf[this.data.data.rf.length - 1].date = this.data.data.rf[this.data.data.rf.length - 1].date
                this.data.count = 0
                this.data.newCount = 0
              }
            }
          } else {
            for (let i = 0; i < newData.data.length; i++) {
              let flag = true
              for (let j = 0; j < this.data.data.rf.length; j++) {
                if (this.data.data.rf[j].date == newData.data[i].date) {
                  this.data.data.rf[j].date = newData.data[i].date
                  flag = false
                }
              }
              if (flag) {
                this.data.data.rf.push(newData.data[i])
              }
            }
          }
          if (this.data.bottomIndex === 7 && Object.keys(this.data.data.rf).length !== 0) {
            this.processData()

            
          }
        }
      }
    },
    key: {
      type: String,
      value: 'kline',
      observer() {

      }
    },
    rfArr: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showData: [{data: []}],
    popUpTime: 0,
    xDomain: [],
    yRange: [],
    needData: {},
    getSetting: false,
    beforeRf: true,
    lineArr: {},
    popUpTimeOut: null,
    showError: false,
    graphCount: 1,
    index: -1,
    showSetting: false,
    rectWidth: 8,
    rectInterval: 2,
    date: '',
    settingItems: [{
      name: 'kdj',
      key: 'kdj',
      checked: false,
      value: 'KDJ显示'
    }, {
      name: 'boll',
      key: 'boll',
      checked: false,
      value: 'BOLL显示'
    }, {
        name: 'bias',
        key: 'bias',
        checked: false,
        value: 'BIAS显示'
    }, {
      name: 'wr',
      key: 'wr',
      checked: false,
      value: 'W&R显示'
    }, {
    name: 'rsi',
    key: 'rsi',
    checked: false,
    value: 'RSI显示'
    }],
    data: {
      kdj: [], // 缺口
    },
    t: '',
    sortKey: ['kdj', 'boll', 'bias', 'wr', 'rsi'],
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
    EventBus.on('changekdate', this.changekDate.bind(this))
    
    let itemSetting = wx.getStorageSync('indicatorSettingItem')
    
    if(itemSetting) {
      this.setData({
        settingItems: itemSetting
      })
      this.data.settingItems = itemSetting
      
      
    } else {
      this.data.getSetting = true
    }
      if(this.data.bottomIndex === 7) {
          this.processData()
      }
    },
    detached() { }
  },
  methods: {
    navToSetting() {
      wx.navigateTo({
        url: '../../pages/indicatorSetting/indicatorSetting'
      })
    },
    getRSIOtherInfo(data) {
      let max = -Infinity
      let min = Infinity
      let Rsi1Arr = []
      let Rsi2Arr = []
      let Rsi3Arr = []
      for(let i = 0; i < data.length; i++) {
        max = data[i].RSI > max ? data[i].RSI : max
        max = data[i].RSI2 > max ? data[i].RSI2 : max
        max = data[i].RSI3 > max ? data[i].RSI3 : max
        min = data[i].RSI < min ? data[i].RSI : min
        min = data[i].RSI2 < min ? data[i].RSI2 : min
        min = data[i].RSI3 < min ? data[i].RSI3 : min
        Rsi1Arr.push({
          x: data[i].x,
          y: data[i].RSI
        })
        Rsi2Arr.push({
          x: data[i].x,
          y: data[i].RSI2
        })
        Rsi3Arr.push({
          x: data[i].x,
          y: data[i].RSI3
        })
      }
      let joinStr = (data) => {
        if(data != undefined) {
          return `RSI(${app.globalData.indicatorSetting.rsi1}): ${data.RSI.toFixed(2)}, RSI(${app.globalData.indicatorSetting.rsi2}): ${data.RSI2.toFixed(2)}, RSI(${app.globalData.indicatorSetting.rsi3}): ${data.RSI3.toFixed(2)}`
        } else {
          return ''
        }
      }
      return  {
        data: [Rsi1Arr, Rsi2Arr, Rsi3Arr],
        minValue: min,
        maxValue: max,
        colors: ['#4D4D4D', '#E3BC05', '#7927A9'],
        title: 'RSI',
        indicatorStr: joinStr(data[this.data.index])
      }
    },
    getWROtherInfo(data) {
      let max = -Infinity
      let min = Infinity
      let wr1Arr = []
      let wr2Arr = []
      for(let i = 0; i < data.length; i++) {
        max = data[i].wr > max ? data[i].wr : max
        max = data[i].wr2 > max ? data[i].wr2 : max
        min = data[i].wr < min ? data[i].wr : min
        min = data[i].wr2 < min ? data[i].wr2 : min
        wr1Arr.push({
          x: data[i].x,
          y: data[i].wr
        })
        wr2Arr.push({
          x: data[i].x,
          y: data[i].wr2
        })
      }
      let joinStr = (data) => {
        if(data != undefined) {
          return `WR(${app.globalData.indicatorSetting.wr1}): ${data.wr.toFixed(2)}, WR(${app.globalData.indicatorSetting.wr2}): ${data.wr2.toFixed(2)}`
        } else {
          return ''
        }
      }
      return  {
        data: [wr1Arr, wr2Arr],
        minValue: min,
        maxValue: max,
        colors: ['#4D4D4D', '#E3BC05', '#7927A9'],
        title: 'W&R',
        indicatorStr: joinStr(data[this.data.index])
      }
    },
    
    getBIASOtherInfo(data) {
      let max = -Infinity
      let min = Infinity
      let Bias1Arr = []
      let Bias2Arr = []
      let Bias3Arr = []
      for(let i = 0; i < data.length; i++) {
        max = data[i].BIAS > max ? data[i].BIAS : max
        max = data[i].BIAS2 > max ? data[i].BIAS2 : max
        max = data[i].BIAS3 > max ? data[i].BIAS3 : max
        min = data[i].BIAS < min ? data[i].BIAS : min
        min = data[i].BIAS2 < min ? data[i].BIAS2 : min
        min = data[i].BIAS3 < min ? data[i].BIAS3 : min
        Bias1Arr.push({
          x: data[i].x,
          y: data[i].BIAS
        })
        Bias2Arr.push({
          x: data[i].x,
          y: data[i].BIAS2
        })
        Bias3Arr.push({
          x: data[i].x,
          y: data[i].BIAS3
        })
      }
      let joinStr = (data) => {
        if(data != undefined) {
          return `B(${app.globalData.indicatorSetting.bias1}): ${data.BIAS.toFixed(2)}, B(${app.globalData.indicatorSetting.bias2}): ${data.BIAS2.toFixed(2)}, B(24): ${data.BIAS3.toFixed(2)}`
        } else {
          return ''
        }
      }
      return  {
        data: [Bias1Arr, Bias2Arr, Bias3Arr],
        minValue: min,
        maxValue: max,
        colors: ['#4D4D4D', '#E3BC05', '#7927A9'],
        title: 'BIAS',
        indicatorStr: joinStr(data[this.data.index])
      }
    },
    getKDJOtherInfo(data) {
      let max = -Infinity
      let min = Infinity
      let KArr = []
      let DArr = []
      let JArr = []
      for(let i = 0; i < data.length; i++) {
        max = data[i].Kvalue > max ? data[i].Kvalue : max
        max = data[i].Dvalue > max ? data[i].Dvalue : max
        max = data[i].Jvalue > max ? data[i].Jvalue : max
        min = data[i].Kvalue < min ? data[i].Kvalue : min
        min = data[i].Dvalue < min ? data[i].Dvalue : min
        min = data[i].Jvalue < min ? data[i].Jvalue : min
        KArr.push({
          x: data[i].x,
          y: data[i].Kvalue
        })
        DArr.push({
          x: data[i].x,
          y: data[i].Dvalue
        })
        JArr.push({
          x: data[i].x,
          y: data[i].Jvalue
        })
      }
      let joinStr = (data) => {
        if(data != undefined) {
          return `K: ${data.Kvalue.toFixed(2)}, D: ${data.Dvalue.toFixed(2)}, J: ${data.Jvalue.toFixed(2)}`
        } else {
          return ''
        }
        
      }
      return  {
        data: [KArr, DArr, JArr],
        minValue: min,
        maxValue: max,
        colors: ['#4D4D4D', '#E3BC05', '#7927A9'],
        title: 'KDJ',
        indicatorStr: joinStr(data[this.data.index])
      }
    },
    getBOLLOtherInfo(data) {
      let max = -Infinity
      let min = Infinity
      let MB = []
      let UP = []
      let DN = []
      for(let i = 0; i < data.length; i++) {
        max = data[i].MB > max ? data[i].MB : max
        max = data[i].UP > max ? data[i].UP : max
        max = data[i].DN > max ? data[i].DN : max
        min = data[i].MB < min ? data[i].MB : min
        min = data[i].UP < min ? data[i].UP : min
        min = data[i].DN < min ? data[i].DN : min
        MB.push({
          x: data[i].x,
          y: data[i].MB
        })
        UP.push({
          x: data[i].x,
          y: data[i].UP
        })
        DN.push({
          x: data[i].x,
          y: data[i].DN
        })
      }
      let joinStr = (data) => {
        if(data != undefined) {
          return `MB: ${data.MB.toFixed(2)}, UP: ${data.UP.toFixed(2)}, DN: ${data.DN.toFixed(2)}`
        } else {
          return ''
        }
        
      }
      return  {
        data: [MB, UP, DN],
        minValue: min,
        maxValue: max,
        title: 'BOLL',
        colors: ['#4D4D4D', '#E3BC05', '#7927A9'],
        indicatorStr: joinStr(data[this.data.index])
      }
    },
    processData() {
      
      if(this.data.bottomIndex != 7) {
        return 
      }
      let graphCount = this.data.graphCount
      if(this.data.getSetting) {
        for(let i = 0; i < this.data.graphCount && i < this.data.settingItems.length; i++) {
          this.data.settingItems[i].checked = true
        }
        this.setData({
          settingItems: this.data.settingItems
        })
      
      
      }
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
        this.data.getSetting = false
      let barGraphHeight = (this.data.height - 20) / graphCount - 18
      this.setData({
        barGraphHeight
      })
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
      this.setData({
        // barGraphHeight,
        graphCount
        
      })
      if (this.data.beforeRf) {
        this.processRf()
      }

      let sortKey = this.data.sortKey
      let beforeRf = [].concat(this.data.data.beforeRf)
      let rf = [].concat(this.data.data.rf)
      for(let i = 0; i < sortKey.length; i++) {
        beforeRf = calculate[sortKey[i]](beforeRf)
        rf = calculate[sortKey[i]](rf)
      }
      
      if (this.data.beforeRf) {
        this.data.needData = beforeRf.slice(this.data.start, this.data.end)
      } else {
        this.data.needData = rf.slice(this.data.start, this.data.end)
      }
      if (this.data.needData.length > 0) {
        let max = +this.data.needData[0].volume
        for (let i = 0; i < this.data.needData.length; i++) {
          this.data.needData[i].x = (this.data.rectWidth + this.data.rectInterval) * i + (this.data.rectWidth / 2)    
          this.data.needData[i].y = this.data.needData[i].Kvalue
        }
        let index = this.data.index
        if(index === -1 || index >= this.data.needData.length) {
          this.data.index = this.data.needData.length - 1
        }
        this.setData({
          date: this.data.needData[this.data.index].date
        })
        let showData = []
        for(let i = 0; i < sortKey.length; i++) {
          let info
          switch(sortKey[i]) {
            case 'kdj':
            info = this.getKDJOtherInfo(this.data.needData)
            break
            case 'boll':
            info = this.getBOLLOtherInfo(this.data.needData)
            break
            case 'bias':
            info = this.getBIASOtherInfo(this.data.needData)
            break
            case 'wr':
            info = this.getWROtherInfo(this.data.needData)
            break
            case 'rsi':
            info = this.getRSIOtherInfo(this.data.needData)
            break
          }
          if(Object.keys(info).length > 0) {
            showData.push({
              data: info.data,
              minValue: info.minValue,
              maxValue: info.maxValue,
              colors: info.colors,
              title: info.title,
              indicatorStr: info.indicatorStr
            })
          }
            
        }
        const tmplData = {
          data: [],
            minValue: 0,
            maxValue: 0,
            colors: [],
            title: '',
            indicatorStr: ''
        }
        for(let i = showData.length; i < graphCount; i++) {
          showData.push(tmplData)
        } 
        this.setData({
          showData
        })
      }
    },
    processRf() {
      let data = this.data.data.rf
      let rf = 1
      let temp = this.data.data.beforeRf = JSON.parse(JSON.stringify(this.data.data.rf))
      for (let i = temp.length - 1; i >= 0; i--) {
        let flag = true
        for (let j = 0; j < this.data.rfArr.length; j++) {
          if (temp[i].date == this.data.rfArr[j].date) {
            temp[i].rf = +this.data.rfArr[j].rf
            flag = false
          }
        }
        if (flag) {
          temp[i].rf = 1
        }
        temp[i].high = temp[i].high * rf
        temp[i].low = temp[i].low * rf
        temp[i].price = temp[i].price * rf
        temp[i].open = temp[i].open * rf
        temp[i].volume = temp[i].volume / rf
        rf *= temp[i].rf
      }
    },
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
      this.data.showSetting = false
      let settings = [].concat(this.data.settingItems)
      for(let i = 0; i < settings.length; i++) {
        if(this.data.sortKey.indexOf(settings[i].key) > -1) {
          settings[i].checked = true
        }
      }
      
      this.setData({
        settingItems: settings
      })
      this.popup.hidePopup()

    },
    settingDialogYes() {
      this.setData({
        sortKey: this.data.isSetting,
        settingItems: this.data.lastSetting
      })
      wx.setStorage({
        key: 'indicatorSettingItem',
        data: this.data.settingItems
      })
      this.processData()
      this.data.showSetting = false
      this.popup.hidePopup()
      
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
      this.data.index = index
      
      this.processData()
    },
    beforeRf() {
      this.setData({
        beforeRf: true
      })
      if (this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
        this.processData()
      }
    },
    cancelRf() {
      this.setData({
        beforeRf: false
      })
      if (this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
        this.processData()
      }
    }
  }
})
