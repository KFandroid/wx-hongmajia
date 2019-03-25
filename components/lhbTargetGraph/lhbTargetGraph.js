// components/targetGraph/targetGraph.js
import EventBus from '../../utils/pubsub.js'

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
        let graphCount = Math.floor(newData / (60 + 29))
        if(graphCount !== 3) {
          graphCount = 3
        }
        this.data.graphCount = graphCount
        
        this.processData()
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
    selectIndex: {
      type: Number,
      value: 2,
      observer(newData) {
        if(newData === 2) {
          let sizeLevel = app.globalData.kSizeLevel
    if(sizeLevel || sizeLevel === 0) {
      this.setData({sizeLevel})
    } else {
      sizeLevel = 2
      this.setData({
        sizeLevel: 2
      })
    }
    this.setData({
      rectInterval: this.data.sizeType[sizeLevel].interval,
      rectWidth: this.data.sizeType[sizeLevel].width
    })
        }
        this.processData()
      }
    },
    lsData: {
      type: Object,
      value: {
        aos: [], // 全部类型
        os: [], // 机构专用
        hk: [], // 港股通
        dp: [], // 全部营业部
        m50: [], // 最近一个月排名前50的活跃营业部
        y50: [],  // 最近一年排名前50的活跃营业部
      },
      observer(newData) {
      
        
        for(let key in newData) {
          
          if(key !== 'page') {
          this.data.historyData[key] = newData[key].concat(this.data.historyData[key])
          } else {
            
            this.data.currentPage = parseInt(newData.page)
          }
        }
        this.processData()
      }
    },
    currentData: {
      type: Object,
      value: {
        aos: [], // 全部类型
        os: [], // 机构专用
        hk: [], // 港股通
        dp: [], // 全部营业部
        m50: [], // 最近一个月排名前50的活跃营业部
        y50: [],  // 最近一年排名前50的活跃营业部
      },
      observer(newData) {
        let data = newData
        this.processData()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectType: '全部机构及营业部',
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
    graphCount: 1,
    index: -1,
    showSetting: false,
    rectWidth: 8,
    currentPage: 1,
    rectInterval: 2,
    settingItems: [{
      name: 'aos',
      key: 'aos',
      checked: true,
      value: '全部机构及营业部'
    }, {
      name: 'os',
      key: 'os',
      checked: false,
      value: '机构专用'
    }, {
      name: 'hk',
      key: 'hk',
      checked: false,
      value: '沪股通及深股通'
    }, {
      name: 'dp',
      key: 'dp',
      checked: false,
      value: '全部营业部'
    }, {
      name: 'm50',
      key: 'm50',
      checked: false,
      value: '月度知名营业部'
    }, {
      name: 'y50',
      key: 'y50',
      checked: false,
      value: '年度知名营业部'
    }],
    historyData: {
      aos: [
      ], // 缺口
      os: [], // 涨跌
      hk: [], // 竞价
      dp: [], // 开盘
      m50: [], // 尾盘
      y50: []
    },
    t: '',
    currentType: 'aos',
    kDateArr: [],
    kDate: null,
    sortKey: ['all', 'minus', 'bs'],
  },
  attached() {
    EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
    EventBus.on('changestocktarget', this.changeIndex.bind(this))
      EventBus.on('changesizelevel', this.changeSizeLevel.bind(this))
      EventBus.on('changekdate', this.changekDate.bind(this))
      EventBus.emit('getk133')
      let sizeLevel = app.globalData.kSizeLevel
      
      let kDate = app.globalData.kDate
      let kDateArr = app.globalData.kDate
      this.data.kDate = kDate
      this.data.kDateArr = kDateArr
      if(sizeLevel || sizeLevel === 0) {
        this.setData({sizeLevel})
      } else {
        sizeLevel = 2
        this.setData({
          sizeLevel: 2
        })
      }
      this.setData({
        rectInterval: this.data.sizeType[sizeLevel].interval,
        rectWidth: this.data.sizeType[sizeLevel].width
      })
    let itemSetting = wx.getStorageSync('lhbTargetSettingItem')
    if(itemSetting) {
      this.setData({
        settingItems: itemSetting
      })
      this.data.settingItems = itemSetting
      let settingItems = [].concat(this.data.settingItems)
      settingItems.forEach((item) => {
        if (item.checked) {
          this.data.currentType = item.key
          
          this.setData({
            selectType: item.value
          })
        }
      })
      this.data.lastSetting = settingItems
      
    }
    this.processData()
    
  },
  /**
   * 组件的方法列表
   */
  pageLifetimes: {
    show(){
      
    }
  },
  methods: {
    changeIndex() {
      
      this.processData()
    },
    checkItem(e) {

      let index = e.currentTarget.dataset.index
      
      let settingItems = [].concat(this.data.settingItems)
      
      settingItems.forEach((item) => {
        item.checked = false
      })
      settingItems[index].checked = !settingItems[index].checked
      let type = settingItems[index].key
      
      
      
      this.setData({
        lastSetting: settingItems,
        settingItems
        
      })
      this.processData()
    },
    changekDate(kDate) {
      this.data.kDate = kDate
      this.data.kDateArr = kDate.dateArr
      this.processData()
    },
    changeSizeLevel(sizeLevel) {
      if(this.data.selectIndex !== 2)
      return 
      this.setData({sizeLevel})
      this.setData({
        rectInterval: this.data.sizeType[sizeLevel].interval,
        rectWidth: this.data.sizeType[sizeLevel].width
      })
    },
    settingDialogNo() {
      this.popup.hidePopup()
      this.popup2.hidePopup()
      this.data.showSetting = false

    },
    settingDialogYes() {
      let currentType
      let selectType
      this.data.settingItems.forEach((item) => {
        if(item.checked === true) {
          currentType = item.key
          selectType = item.value
        }
        
      })
      this.setData({
        currentType,
        selectType,
        settingItems: this.data.lastSetting
      })
      wx.setStorage({
        key: 'lhbTargetSettingItem',
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
      
      this.data.index = index
      this.processData()
    },
    processData() {
      let graphCount = this.data.graphCount
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
      
      let barGraphHeight = (this.data.height - graphCount * 19 - 26)/ graphCount
      this.setData({
        barGraphHeight,
        graphCount
      })
      let allData = {
        all: {
          info: {
            title:'',
            title1:'总量：',
            title2: ''
          },
          mode: 'normal',
          data: []
        }, // 缺口
        minus: {
          info: {
            title: '',
            title1: '差量：',
            title2: ''
          },
          mode: 'updown',
          data: []
        }, // 涨跌
        bs: {
          info: {
            title: '',
            title1: '买量：',
            title2: '卖量'
          },
          mode: 'updown',
          data: []
        }
      }
      
      let currentData = this.data.historyData[this.data.currentType].concat(this.data.currentData[this.data.currentType])
      
      let kDate = this.data.kDate
      let kDateArr = this.data.kDateArr
      this.data.allData = allData
      
      let showCount = Math.floor(this.data.width / (this.data.rectInterval + this.data.rectWidth))
      if(kDate && this.data.selectIndex === 2) {
        let startIndex = currentData.length - showCount
        let endIndex = currentData.length - 1
        for(let i = 0; i < currentData.length; i++) {
          if(currentData[i].t === kDate.start) {
            startIndex = i
          }
          if(currentData[i].t === kDate.end) {
            endIndex = i
          }
        }
        
        let start = parseInt(kDate.start.split('-').join(''))
        let currentStart
        
        if(currentData.length > 0) {
          currentStart = parseInt(currentData[0].t.split('-').join(''))

        } else {
          currentStart = 0
        }
        if(start < currentStart && this.data.currentPage !== 1) {
          
          EventBus.emit('prevlhbtarget', this.data.currentPage - 1)
        }
          currentData = currentData.slice(startIndex, endIndex + 1)
        let lastEqualDate = 0
        let dataTmpl
        for(let i = 0; i < kDateArr.length; i++) {
          lastEqualDate = i
          if(i < currentData.length && kDateArr[i] === currentData[i].t) {
            lastEqualDate = i + 1
          } else {
            dataTmpl = {
              t: kDateArr[i],
              b: 0,
              s: 0
            }
              currentData.splice(lastEqualDate, 0, dataTmpl)
            lastEqualDate = lastEqualDate + 1
          }
        }
        
          currentData = currentData.slice(0, kDateArr.length)
        
      } else {
        this.setData({
          rectInterval: this.data.sizeType[2].interval,
          rectWidth: this.data.sizeType[2].width
        })
        currentData = currentData.slice(currentData.length - showCount - 1, currentData.length)
    
      }
      
      currentData.forEach(element => {
        let all = {}
        let minusData = {}
        let bsData = {}
        all.t = element.t
        all.y = parseFloat((element.b + element.s)).toFixed(2)
        allData.all.data.push(all)
        minusData.t = element.t
        
        if(element.b >= element.s) {
          minusData.y1 = parseFloat((element.b - element.s)).toFixed(2)
          minusData.y2 = ''
        } else {
          minusData.y2 = parseFloat((element.b - element.s)).toFixed(2)
          minusData.y1 = ''
        }
        allData.minus.data.push(minusData)
        bsData.t = element.t
        
        bsData.y1 = parseFloat(element.b).toFixed(2)
        bsData.y2 = -parseFloat(element.s).toFixed(2)
        allData.bs.data.push(bsData)
      })
      let data = []
      let sortKey = this.data.sortKey
      for(let i = 0; i < sortKey.length; i++) {
        data.push(allData[sortKey[i]])
      }
      data.forEach(element => {
        if(element.data.length) {
          let index = this.data.index
          element.minNum = Infinity
          element.maxNum = -Infinity
          if(index === -1 || index >= element.data.length) {
            index = element.data.length - 1
          }
          element.currentInfo = element.data[index]
          if(element.mode === 'normal') {
            element.currentInfo.y1 = element.currentInfo.y
          }
         
          if(element.mode === 'updown') {
            element.data.forEach(el => {
              
              if(parseFloat(el['y1'])> parseFloat(element.maxNum)) {
                element.maxNum = parseFloat(el['y1'])
              }
              if(parseFloat(el['y2']) < parseFloat(element.minNum)) {
                element.minNum = parseFloat(el['y2'])
              }
            })
            if(parseFloat(element.maxNum) > Math.abs(element.minNum)) {
              element.minNum = -parseFloat(element.maxNum)
            }  else {
              element.maxNum = -parseFloat(element.minNum)
            }
          } else if(element.mode === 'normal') {
            element.minNum = 0
            element.data.forEach(el => {
              
              if(parseFloat(el['y'])> parseFloat(element.maxNum)) {
                element.maxNum = parseFloat(el['y'])
              }
            })
            element.data = element.data.map(el => {
              return Object.assign({}, el, {
                y1: el.y,
                y2: ''
              })
            })
          }
        }
        
      })
      
        
          
          this.setData({
            showData: data
          })
          
    }
  }
})
