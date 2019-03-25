// pages/stockExceptionItem/stockExceptionItem.js
import {
  DBSystem
} from '../../utils/db/DBSystem.js'
import WXStorage from '../../utils/WXStorage.js'
import debounce from '../../utils/debounce.js'
import util from '../../utils/util.js'
import {
  connect
} from "../../utils/socket"
const dbSystem = new DBSystem()
const tableRowHeight = 40
const addZero = function(code, zeroNum) {
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

  },

  /**
   * 组件的初始数据
   */
  data: {
    today: new Date(),
    lineHeight: tableRowHeight,
    index: 0,
    date: util.formatDate(new Date()),
    page: 1,
    filter: (item) => {
      return true
    },
    totalPage: 1,
    sortCode: '0000',
    itemCode: '',
    sortMode: 1,
    lineNum: 0,
    bottomVal: 0,
    topVal: 0,
    data: [],
    customStockTable: {},
    stockCode: '',
    storage: null,
    scrollHeight: 600,
    selector: [],
    selectedId: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(option) {
      if (!wx.getStorageSync('customStockClass')) {
        wx.setStorageSync('customStockClass', [{
          id: +(+new Date() + "").substring(0, 10),
          name: '自选股'
        }])
      }
      this.setData({
        stockInfo: option,
        stockCode: addZero(option.code, 6),
        itemCode: '000000',
        selector: wx.getStorageSync('customStockClass')
      })
      this.popup = this.selectComponent("#popup");
    },
    setItemArr: function() {
      // 得到自定义的小项目

      let a106 = app.globalData.a106.data
      let itemArr = []
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
      itemArr.unshift({
        cno: '00',
        totalName: '全部'
      })
      this.setData({
        itemArr,
      })
    },
    convert2B: function() {
      let a104 = this.data.a104
      let tree
      if (a104) {
        let data104 = a104.data
        tree = data104
        for (let i = 0, length = tree.length; i < length; i++) {
          let cno = tree[i].cno
          let itemArr = this.data.itemArr
          for (let index = 0, length2 = itemArr.length; index < length2; index++) {
            let parentItem = itemArr[index]
            if (cno === parentItem.cno) {
              tree[i].name = parentItem.name
              tree[i].cname = parentItem.cname
              tree[i].keyName = parentItem.keyName
            }
          }
        }
        tree = tree.filter(this.data.filter)
        if (this.data.sortMode === 1) {
          tree = tree.reverse()
        }
        this.setData({
          data: tree
        })
      }
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
      let kData = wx.getStorageSync('k' + key + sortCode) || wx.getStorageSync('k' + key2 + sortCode)
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
    onShow: function() {
      // 得到可选子项
      this.setItemArr()
      let storage = new WXStorage([{
        type: '104',
        needIntervalUpdate: false,
        changeCb: (data) => {
          this.convert2B()
          if (parseInt(data.page) === parseInt(data.totalPage)) {
            wx.setStorageSync(
              'last104', {
                page: parseInt(data.page),
                totalPage: parseInt(data.totalPage)
              }
            )
          }
          this.setData({
            totalPage: parseInt(data.totalPage)
          })
        },
        createKey: () => {
          const TYPE = 104
          let val = this.createKeyStr(TYPE, this.data.itemCode, this.data.stockCode)
          return val
        }
      },{
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
        intervalTime: 6000,
        createKey: () => {
          const TYPE = 108
          let val = this.createKeyStr(108, '000000', this.data.stockCode, true)
          return val
        }
      }], this, () => {})
      this.setData({
        storage
      })
      this.setPageView()

      let customStockTable = dbSystem.getDataByKey('customStockTable', {
        defaultValue: {}
      })
      this.setData({
        customStockTable
      })

      connect((data) => {
        storage.observeFileChange(data.type, data)
      })

    },
    setPageView: function() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.flex-box').boundingClientRect(function(res) {
        res.top
      })
      query.selectViewport().scrollOffset(function(res) {
        res.scrollTop // 显示区域的竖直滚动位置
      })
      const sysInfo = wx.getSystemInfoSync()
      query.exec((res) => {
        this.setData({
          bottomVal: res[0].top - sysInfo.windowHeight,
          topVal: -res[0].top
        })
      })
      query.select('.scrollView').boundingClientRect(function(res) {
        res.top
      })
      query.selectViewport().scrollOffset(function(res) {
        res.scrollTop // 显示区域的竖直滚动位置
      })
      query.exec((res) => {
        this.setData({
          scrollHeight: sysInfo.windowHeight - res[2].top - 44,
        })
      })
    },
    onHide: function(event) {
      this.data.storage.clearFile()
    },
    onUnload: function(event) {
      this.data.storage.clearFile()
    },
    pageUp: function() {
      let page = this.data.page - 1
      this.setData({
        page,
      })
      this.getPageData()
    },
    pageDown: function() {
      let page = this.data.page + 1
      this.setData({
        page,
      })
      this.getPageData()
    },
    getPageData: debounce(() => {
      const keyValue = this.createKeyStr(104, this.data.itemCode, this.data.stockCode)
      this.data.storage.getData(keyValue)
    }, 5000),
    changeSort: function(e) {
      if (this.data.sortMode === 0) {
        //改为倒序
        this.setData({
          sortMode: 1,
          page: 1
        })
      } else {
        //改为正序
        let lastPage = wx.getStorageSync('last104')
        if (lastPage) {
          this.setData({
            page: lastPage.page
          })
        } else {
          this.setData({
            page: 0
          })
        }
        this.setData({
          sortMode: 0
        })
      }
      const keyValue = this.createKeyStr(104, this.data.itemCode, this.data.stockCode)
      this.data.storage.getData(keyValue)
    },
    bindOptionChange: function(e) {
      this.setData({
        index: e.detail.value
      })
      let cno = this.data.itemArr[e.detail.value].cno
      let filter = (item) => {
        return true
      }
      if (cno !== '00') {
        filter = (item) => {
          if (item.cno === cno) {
            return true
          } else {
            return false
          }
        }
      }
      this.setData({
        filter,
      })
      this.convert2B()
    },
    addCustom: function() {
      this.popup.hidePopup();
      let customStockTable = this.data.customStockTable
      let temp = this.data.customStockTable[this.data.selector[this.data.selectedId].name]
      if (temp && temp.indexOf(this.data.stockInfo.stockNo) > -1) {
        wx.showToast({
          title: '已在自选股列表中！',
        })
      } else {
        if (!customStockTable[this.data.selector[this.data.selectedId].name]) {
          customStockTable[this.data.selector[this.data.selectedId].name] = []
        }
        customStockTable[this.data.selector[this.data.selectedId].name].push(this.data.stockInfo.stockNo)
        dbSystem.execSetStorageSync('customStockTable', customStockTable)
        this.setData({
          customStockTable
        })
        wx.showToast({
          title: '添加自选股成功！',
        })
      }
    },
    showPopup() {
      this.popup.showPopup();
    },
    closePop() {
      this.setData({
        customName: ''
      })
      this.popup.hidePopup();
    },
    bindPickerChange: function(e) {
      this.setData({
        selectedId: e.detail.value
      })
    }
  }
})