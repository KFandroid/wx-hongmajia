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
        let graphCount = Math.floor(newData / (60 + 19))
        if(graphCount > 4) {
          graphCount = 4
        }
        this.data.graphCount = graphCount
        let settingItems = this.data.settingItems
        for(let i = 0; i < graphCount; i++) {
          settingItems[i].checked = true
        }
        this.setData({
          settingItems
        })
        this.processData()
        // this.setData({
        //   graphCount
        // })
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
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        
      }
    },
    lsData: {
      type: Object,
      value: {
        qk: [], // 缺口
        zd: [], // 涨跌
        jj: [], // 竞价
        kp: [], // 开盘
        wp: [], // 尾盘
      },
      observer(newData) {
        
        this.data.currentPage = parseInt(newData.page)
        if(Object.keys(newData).length === 0) {
          return 
        }
        for(let key in newData) {
          if(key !== 'page') {
          this.data.historyData[key] = newData[key].concat(this.data.historyData[key])
          }
        }
        if(newData.qk.length) {
          this.processData()
        }
      }
    },
    currentData: {
      type: Object,
      value: {
        qk: [], // 缺口
        zd: [], // 涨跌
        jj: [], // 竞价
        kp: [], // 开盘
        wp: [], // 尾盘
      },
      observer(newData) {
        // let qk
        let data = newData
        // 
        
        if(Object.keys(newData).length) {
          if(this.data.historyData['qk'].length || newData['qk'].length) {
            this.processData()
          } 
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
    graphCount: 1,
    index: -1,
    showSetting: false,
    rectWidth: 8,
    rectInterval: 2,
    settingItems: [{
      name: 'qk',
      key: 'qk',
      checked: false,
      value: '缺口显示'
    }, {
      name: 'zd',
      key: 'zd',
      checked: false,
      value: '涨跌显示'
    }, {
      name: 'jj',
      key: 'jj',
      checked: false,
      value: '竞价放量显示'
    }, {
      name: 'kp',
      key: 'kp',
      checked: false,
      value: '开盘放量显示'
    }, {
      name: 'wp',
      key: 'wp',
      value: '尾盘放量显示'
    }],
    historyData: {
      qk: [], // 缺口
      zd: [], // 涨跌
      jj: [], // 竞价
      kp: [], // 开盘
      wp: [], // 尾盘
    },
    t: '',
    kDateArr: [],
    kDate: null,
    sortKey: ['qk', 'zd', 'jj', 'kp', 'wp'],
  },
  attached() {
    EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
    EventBus.on('changekdate', this.changekDate.bind(this))
    EventBus.on('changesizelevel', this.changeSizeLevel.bind(this))
    let kDate = app.globalData.kDate
      let kDateArr = app.globalData.kDate
      this.data.kDate = kDate
      this.data.kDateArr = kDateArr
    let itemSetting = wx.getStorageSync('ydSettingItem')
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
        key: 'ydSettingItem',
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
      
      let index = Math.floor(crosshairPosition.x / (this.data.rectInterval + this.data.rectWidth))
      // if(index > (this.data.historyData['qk'].length + this.data.currentData['qk'].length)) {
      //   return
      // }
      this.data.index = index
      
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
        qk: {
          mode: "updown",
          info: {
            title:'缺口形成',
            title1:'向上跳空：',
            title2: '向下跳空：'
          },
          data: []
        }, // 缺口
        zd: {
          mode: "updown",
          info: {
            title: '涨跌停',
            title1: '涨停：',
            title2: '跌停：'
          },
          data: []
        }, // 涨跌
        jj: {
          mode: "normal",
          info: {
            title: '竞价放量：',
            title1: '',
            title2: ''
          },
          data: []
        }, // 竞价
        kp: {
          mode: "normal",
          info: {
            title: '开盘放量：',
            title1: '',
            title2: ''
          },
          data: []
        }, // 开盘
        wp: {
          mode: "normal",
          info: {
            title: '尾盘放量：',
            title1: '',
            title2: ''
          },
          data: []
        }, // 尾盘
      }
      let data = []
      let sortKey = this.data.sortKey
      
      for(let i = 0; i < sortKey.length; i++) {
        let currentData = this.data.currentData[sortKey[i]]
        
        if(currentData) {
          allData[sortKey[i]].data = this.data.historyData[sortKey[i]].concat(this.data.currentData[sortKey[i]])
        } else {
          allData[sortKey[i]].data = this.data.historyData[sortKey[i]]
        }
        allData[sortKey[i]].key = sortKey[i]
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
          if(temp.mode === 'updown') {
            temp.data.forEach(element => {
              
              if(element['y1']> temp.maxNum) {
                temp.maxNum = element['y1']
              }
              if(element['y2'] < temp.minNum) {
                temp.minNum = element['y2']
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
              if(element['y']> temp.maxNum) {
                temp.maxNum = element['y']
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
          if(temp.hasOwnProperty('currentInfo')) {
            switch(temp.key) {
              case 'qk':
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '缺口向上'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '缺口向下'
                }
                break
                case 'jj':
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '有'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '缺口向下'
                }
                break
                case 'zd':
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '涨停'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '跌停'
                }
                break
                case 'wp':
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '有'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '缺口向下'
                }
                break
                case 'kp':
                if(temp.currentInfo.y > 0) {
                  temp.info.title1 = '有'
                } else if(temp.currentInfo.y === 0) {
                  temp.info.title1 = '无'
                } else {
                  temp.info.title1 = '缺口向下'
                }
                break  
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
          
          if(kDate && this.data.selectIndex === 2) {
            let startIndex = data[0].data.length - showCount
            let endIndex = data[0].data.length
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
              
              EventBus.emit('prevtarget', this.data.currentPage - 1)
            }
            
            data.forEach(element => {
              element.data  = element.data.slice(startIndex, endIndex)
            })
            let lastEqualDate = 0
            let dataTmpl 
            if(!data[0].data.length) {
              return
            }
            
            for(let i = 0; i < kDateArr.length - 1; i++) {
              lastEqualDate = i
              if(i < data[0].data.length && kDateArr[i] === data[0].data[i].t) {
                lastEqualDate = i
              } else {
                dataTmpl = {
                  t: kDateArr[i],
                  y: 0,
                  y1: 0,
                  y2: 0
                }
                
                data.forEach(element => {
                  element.data.splice(lastEqualDate, 0, dataTmpl)
                })
                lastEqualDate = lastEqualDate + 1
              }
            }
           
            
              
          } else {
            this.setData({
              rectInterval: this.data.sizeType[2].interval,
              rectWidth: this.data.sizeType[2].width
            })
            data.forEach(element => {
              element.data  = element.data.slice(element.data.length - showCount, element.data.length)
            })
          }
          
          let tempData = data.slice(0, graphCount)
          
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
