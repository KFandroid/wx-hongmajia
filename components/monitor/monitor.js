// components/monitor/monitor.js
import debounce from '../../utils/debounce.js'
import EventBus from '../../utils/pubsub.js'
const app = getApp()
const util = require('../../utils/util.js')
const addZero = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    t126: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let k105 = app.globalData.a105.data
        for (let i = 0; i < k105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (k105[i].stockCode == data[j].stockCode) {
              data[j].stockName = k105[i].stockName
            }
          }
        }

        let k106 = app.globalData.a106.data
        let itemArr = []
        for (let i = 0; i < k106.length; i++) {
          let cno = k106[i].no
          let temp = {}
          if (k106[i].hasOwnProperty('children')) {
            let children = k106[i].children
            for (let j = 0; j < children.length; j++) {
              temp = Object.assign({}, children[j])
              temp.cno = '' + cno + children[j].cno
              temp.name = k106[i].name
              temp.code = addZero(cno, 3) + addZero(children[j].cno, 3)
              temp.totalName = '' + temp.name + '-' + temp.cname
              itemArr.push(temp)
            }
          }
        }
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < itemArr.length; j++) {
            if (data[i].no == itemArr[j].cno) {
              data[i].cname = itemArr[j].cname
            }
          }
          if (data[i].value == 0) {
            data[i].type = "移除"
          } else {
            data[i].type = "加入"
          }
        }
        if (data) {
          this.setData({
            data: data.reverse(),
            totalPage: newData.totalPage + 1
          })
        }
      }
    },
    t127: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let k105 = app.globalData.a105.data
        for (let i = 0; i < k105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (k105[i].stockCode == data[j].stockCode) {
              data[j].stockName = k105[j].stockName
            }
          }
        }
        let k106 = app.globalData.a106.data
        let itemArr = []
        for (let i = 0; i < k106.length; i++) {
          let cno = k106[i].no
          let temp = {}
          if (k106[i].hasOwnProperty('children')) {
            let children = k106[i].children
            for (let j = 0; j < children.length; j++) {
              temp = Object.assign({}, children[j])
              temp.cno = '' + cno + children[j].cno
              temp.name = k106[i].name
              temp.code = addZero(cno, 3) + addZero(children[j].cno, 3)
              temp.totalName = '' + temp.name + '-' + temp.cname
              itemArr.push(temp)
            }
          }
        }
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < itemArr.length; j++) {
            if (data[i].no == itemArr[j].cno) {
              data[i].cname = itemArr[j].cname
            }
          }
          if (data[i].value == 0) {
            data[i].type = "移除"
          } else {
            data[i].type = "加入"
          }
        }
        if (data) {
          this.setData({
            data: data.reverse(),
            totalPage: newData.totalPage + 1
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: [],
    currentPage: 1,
    totalPage: null,
    date: util.formatTimeYmd(new Date()),
  },
  lifetimes: {
    attached() {
      let t109 = wx.getStorageSync('a109000000000000000000000000000').data
      let newTradeDate
      if (t109) {
        newTradeDate = t109[t109.length - 1]
        this.setData({
          date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    updateStock(e) {
      let a105 = app.globalData.a105.data
      let lists = []
      let codeList = []
      for (let i = 0; i < a105.length; i++) {
        for (let j = 0; j < this.data.data.length; j++) {
          if (this.data.data[j].stockCode == a105[i].stockCode && codeList.indexOf(this.data.data[j].stockCode) < 0) {
            lists.push(a105[i])
            codeList.push(a105[i].stockCode)
          }
        }
      }
      let currentStock
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].stockCode == e.currentTarget.dataset.item.stockCode) {
          currentStock = lists[i]
        }
      }
      
      EventBus.emit('changeStockAndStockList', {
        stock: currentStock,
        stockList: lists
      })
    },
    pageUp: debounce(function () {
      this.setData({
        currentPage: this.data.currentPage - 1
      })
      if (this.data.currentPage !== 1) {
        this.triggerEvent('getMore', {
          currentPage: this.data.totalPage - this.data.currentPage + 1,
          closeK126: true
        })
      } else {
        this.triggerEvent('getK126')
      }
    }, 200),
    pageDown: debounce(function () {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      if (this.data.currentPage !== 1) {
        this.triggerEvent('getMore', {
          currentPage: this.data.totalPage - this.data.currentPage + 1,
          closeK126: true
        })
      } else {
        this.triggerEvent('getK126')
      }
    }, 200)
  }
})
