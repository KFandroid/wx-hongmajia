// pages/stockTable/stockTable.js
import { formatDate } from '../../utils/util.js'
import debounce from '../../utils/debounce.js'
import { connect } from '../../utils/socket.js'
import WXStorage from '../../utils/WXStorage.js'

const addZero = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}

const today = formatDate(new Date())
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
    itemName: '开盘-连续上涨',
    dateFlag: '最新',
    today,
    currentSortItem: 'time',
    sortCode: '0050',
    scrollHeight: 300,
    sortItem: '时间正序',
    date: "2018-11-29",
    page: 1,
    handle103: null,
    storage: null,
    totalPage: 1,
    itemCode: '',
    pageNum: 30,
    data: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh() // 要手动调用
    },
    onLoad: function (option) {
      this.setData({
        date: option.date,
        itemCode: option.cno,
        itemName: option.name
      })
      if (this.data.date != this.data.today) {
        this.setData({
          dateFlag: '历史',
        })
      }
    },
    setView() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.scrollView').boundingClientRect(function (res) {
        res.top
      })
      query.selectViewport().scrollOffset(function (res) {
        res.scrollTop // 显示区域的竖直滚动位置
      })
      const sysInfo = wx.getSystemInfoSync()
      query.exec((res) => {
        this.setData({
          scrollHeight: sysInfo.windowHeight - res[0].top - 44,
          topVal: -res[0].top
        })
      })
    },
    convert2B: function () {

      let a103 = this.data.a103
      let a105 = this.data.a105
      let tree = []
      if (a103 && a105) {
        let data103 = a103.data
        let data105 = a105.data
        tree = data103
        for (let i = 0, length = tree.length; i < length; i++) {
          let stockNo = tree[i].stockNo
          for (let index = 0, length2 = data105.length; index < length2; index++) {
            if (data105[index].stockCode === stockNo) {
              tree[i] = Object.assign({}, tree[i], data105[index])
            }
          }
        }
        this.setData({
          data: tree
        })
      }
    },
    changeSort: function (e) {
      let sortCode = e.currentTarget.dataset.sort
      let currentSortCode = this.data.sortCode.slice(0, 3)
      let sortItem
      let sortName

      switch (sortCode) {
        case '001':
          sortItem = '代码'
          sortName = 'code'
          break
        case '002':
          sortItem = '名称'
          sortName = 'name'
          break
        case '003':
          sortItem = '价格'
          sortName = 'price'
          break
        case '004':
          sortItem = '涨幅'
          sortName = 'rise'
          break
        case '005':
          sortItem = '更新时间'
          sortName = 'time'
          break
        case '006':
          sortItem = '成交量'
          sortName = 'hand'
          break
        case '007':
          sortItem = '关键值'
          sortName = 'key'
          break
      }
      if (this.data.sortCode[3] === '0') {
        this.setData({
          sortCode: sortCode + '1',
          sortItem: sortItem + '倒序',
          currentSortItem: sortName
        })
      } else {
        this.setData({
          sortCode: sortCode + '0',
          sortItem: sortItem + '正序',
          currentSortItem: sortName
        })
      }
      
      let keyValue = this.createKeyStr(103, this.data.itemCode, '000000')
      this.data.storage.getData(keyValue)
    },
    pageUp: debounce(function () {
      let page = this.data.page - 1
      this.setData({
        page,
      })
      let keyValue = this.createKeyStr(103, this.data.itemCode, '000000')
      this.data.storage.getData(keyValue)
    }, 200),
    pageDown: debounce(function () {
      let page = this.data.page + 1
      this.setData({
        page,
      })
      let keyValue = this.createKeyStr(103, this.data.itemCode, '000000')
      this.data.storage.getData(keyValue)
    }, 200),
    onShow: function () {
      let storage = new WXStorage([{
        type: '103',
        changeCb: (data) => {
          this.setData({
            totalPage: parseInt(data.totalPage)
          })
        },
        createKey: () => {
          let val = this.createKeyStr(103, this.data.itemCode, '000000')
          return val
        }
      }, {
        type: '105',
        changeCb: (data) => {
        },
        createKey: () => {
          let val = this.createKeyStr(105, '000000', '000000', true)
          return val
        }
      }], this, this.convert2B)
      this.setData({
        storage
      })
      connect((data) => {
        storage.observeFileChange(data.type, data)
      })

      this.setView()
      if (this.data.handle108) {
        clearInterval(this.data.handle108)
      }
      let handle = setInterval(() => {
        const keyValue = this.createKeyStr(103, this.data.itemCode, '000000')
        this.data.storage.getData(keyValue)
      }, 6000)
      this.setData({
        handle103: handle
      })
    },
    createKeyStr: function (fileType, itemCode, stockCode, isStatic = false) {
      const addZero = function (code, zeroNum) {
        code = String(code).split('')
        let leftZero = zeroNum - code.length
        for (let i = 0; i < leftZero; i++) {
          code.unshift('0')
        }
        return code.join('')
      }
      let page = addZero(this.data.page, 3)
      let dateStr = this.data.date.split('-').join('')
      let sortCode
      if (!isStatic) {
        dateStr = this.data.date.split('-').join('')
        sortCode = this.data.sortCode
      } else {
        page = '000'
        dateStr = '00000000'
        sortCode = '0000'
      }
      let timestamp = ''
      let key = '' + fileType + itemCode + page + stockCode + dateStr
      let kData = app.globalData['a' + key + sortCode]
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
    onHide: function () {
      clearInterval(this.data.handle103)
    },
    onUnload: function () {
      clearInterval(this.data.handle103)
    },
    navigateToStock: function (e) {
      let item = e.currentTarget.dataset.item
      let cno = this.data.itemCode
      let code = addZero(item.code, 6)
      wx.navigateTo({
        url: `../stockExceptionItem/stockExceptionItem?code=${code}&stockNo=${item.stockNo}&name=${item.stockName}&cno=${cno}`
      })
    },
  }
})
