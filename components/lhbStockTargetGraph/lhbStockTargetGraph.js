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
      value: 20,
    },
    height: {
      type: Number,
      value: 300,
      observer(newData){
        let graphCount = Math.floor(newData / 42)
        if(graphCount > 6) {
          graphCount = 6
        }
        this.data.graphCount = graphCount
        this.data.sortKey = this.data.sortKey.slice(0 ,graphCount)
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
    if(sizeLevel) {
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
    currentPage: 1,
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
      os: [
      ], // 涨跌
      hk: [], // 竞价
      dp: [], // 开盘
      m50: [], // 尾盘
      y50: []
    },
    t: '',
    kDateArr: [],
    kDate: null,
    currentType: 'aos',
    sortKey: ['aos', 'os', 'hk', 'dp', 'm50', 'y50']
  },
  attached() {
    EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
    EventBus.on('changesizelevel', this.changeSizeLevel.bind(this))
    EventBus.on('changekdate', this.changekDate.bind(this))
    EventBus.emit('getk141')
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
    let itemSetting = wx.getStorageSync('lhbStockTargetSettingItem')
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
    initSetting() {
      let sizeLevel = app.globalData.kSizeLevel
      
      if (sizeLevel || sizeLevel === 0) {
        this.setData({
          sizeLevel
        })
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
        key: 'lhbStockTargetSettingItem',
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
    changeSizeLevel(sizeLevel) {
      
      if(this.data.selectIndex !== 2)
      return 
      this.setData({sizeLevel})
      this.setData({
        rectInterval: this.data.sizeType[sizeLevel].interval,
        rectWidth: this.data.sizeType[sizeLevel].width
      })
    },
    moveCrosshair(crosshairPosition) {
      
      let index = Math.round(crosshairPosition.x / (this.data.rectInterval + this.data.rectWidth))
      
      if(index > (this.data.historyData['aos'].length + this.data.currentData['aos'].length)) {
        return
      }
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
      
      let allData = {
        aos: {
          info: {
            title:'全部机构及营业部：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        }, 
        os: {
          info: {
            title:'机构专用：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        },
        hk: {
          info: {
            title:'沪股通及深股通：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        },
        dp: {
          info: {
            title:'全部营业部：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        },
        m50: {
          info: {
            title:'月度知名营业部：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        },
        y50: {
          info: {
            title:'年度知名营业部：',
            title1:'',
            title2: ''
          },
          data: [],
          mode: 'single'
        }
      }
      let keyArr = this.data.sortKey
      for(let i = 0; i < keyArr.length; i++) {
        let currentData = this.data.historyData[keyArr[i]].concat(this.data.currentData[keyArr[i]])
      currentData.forEach(element => {
        let all = {}
        
        all.t = element.t
        all.y = element.y
        all.s = element.s
        all.b = element.b
        allData[keyArr[i]].data.push(all)
        
      })
      }
      
      let data = []
      let sortKey = this.data.sortKey
      for(let i = 0; i < sortKey.length; i++) {
      
        data.push(allData[sortKey[i]])
      }
      this.data.allData = allData
      function dealTmpData(tempData, index) {
        let data = []
        
        for(let i = 0; i < tempData.length; i++) {
          let temp = {}
          temp.mode = tempData[i].mode
          temp.data = tempData[i].data
          temp.info = tempData[i].info
          temp.minNum = Infinity
          temp.maxNum = -Infinity
          temp.data = temp.data.map(element => {
            if(element['y']> temp.maxNum) {
              temp.maxNum = element['y']
            }
            return Object.assign({}, element, {
              y: element.y,
            })
          })
          if(index === -1 || index >= temp.data.length) {
            index = temp.data.length - 1
          }
          if(temp.data.length) {
            temp.currentInfo = temp.data[index]
          }
          if(temp.hasOwnProperty('currentInfo')) {
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '有'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '缺口向下'
                }
          }
          
          
          data.push(temp)
        }
        return data
      }

      let kDate = this.data.kDate
          let kDateArr = this.data.kDateArr
          this.data.allData = allData

          let showCount = Math.floor(this.data.width / (this.data.rectInterval + this.data.rectWidth))
          // 
          if(kDate && this.data.selectIndex === 2) {
            
            let startIndex = 0
            let endIndex = data[0].data.length - 1
            for(let i = 0; i < data[0].data.length; i++) {
              if(data[0].data[i].t === kDate.start) {
                startIndex = i
              }
              if(data[0].data[i].t === kDate.end) {
                endIndex = i
              }
            }
            
            let start = parseInt(kDate.start.split('-').join(''))
            
            if(data[0].data.length === 0) {
              return
            }
            let currentStart = parseInt(data[0].data[0].t.split('-').join(''))
            
            if(start < currentStart && this.data.currentPage !== 1) {
              
              EventBus.emit('prevstocklhb', this.data.currentPage - 1)
            }
            
            data.forEach(element => {
              element.data  = element.data.slice(startIndex, endIndex + 1)
            })
            let lastEqualDate = 0
            let dataTmpl 
            if(!data[0].data.length) {
              return
            }
              
            
            for(let i = 0; i < kDateArr.length; i++) {
              if(i < data[0].data.length && kDateArr[i] === data[0].data[i].t) {
                lastEqualDate = i + 1
              } else {
                dataTmpl = {
                  t: kDateArr[i],
                  y: 0,
                  s: 0,
                  b: 0
                }
                
                data.forEach(element => {
                  element.data.splice(lastEqualDate, 0, dataTmpl)
                })
                lastEqualDate = lastEqualDate + 1
              }
            }
            data.forEach(element => {
              element.data = element.data.slice(0, kDateArr.length)
            })
            
              
          } else {
            
            this.setData({
              rectInterval: this.data.sizeType[2].interval,
              rectWidth: this.data.sizeType[2].width
            })
            data.forEach(element => {
              element.data  = element.data.slice(element.data.length - showCount - 1, element.data.length)
            })
          }
          let tempData = data
          tempData = dealTmpData(tempData, this.data.index)
          const tmplData = {
            maxNum:0,
            info: {
              title: '',
              title1: '',
              title2: ''
            },
            currentInfo: {
              y1: '',
              y2: ''
            },
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
