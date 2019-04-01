// pages/search/search.js
import WXStorage from '../../utils/WXStorage.js'
import util from '../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: util.formatDate(new Date()),
    stockList: [],
    searchList: [{ "stockCode": "A00001", "code": "060001", "stockName": "上证指数", "py": "SZZS", "market": "上指", "type": "" },
    { "stockCode": "A00002", "code": "060002", "stockName": "Ａ股指数", "py": "AGZS", "market": "上指", "type": "" },
    { "stockCode": "A00003", "code": "060003", "stockName": "Ｂ股指数", "py": "BGZS", "market": "上指", "type": "" },
    { "stockCode": "B00001", "code": "060009", "stockName": "深证成指", "py": "SZCZ", "market": "深指", "type": "" },
    { "stockCode": "B00002", "code": "060010", "stockName": "深成指R", "py": "SCZR", "market": "深指", "type": "" },
    { "stockCode": "B00005", "code": "060012", "stockName": "中小板指", "py": "ZXBZ", "market": "深指", "type": "" },
    { "stockCode": "B00006", "code": "060013", "stockName": "创业板指", "py": "CYBZ", "market": "深指", "type": "" }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.stockList = app.globalData.a105.data
    app.globalData.stockList = app.globalData.a105.data
    let stockList = []
    for(let i = 0; i < app.globalData.stockList.length; i++) {
      if(app.globalData.stockList[i].code.slice(0, 2) === '06') {
        stockList.push(app.globalData.stockList[i])
      }
    }
  },
  navigateToStockInfo: function (e) {
    app.globalData.stockList = app.globalData.a105.data
    let stock = e.currentTarget.dataset.stock
    wx.setStorageSync(
      'selectStock',
      stock
    )
    app.globalData.selectStock = stock
    debugger
    wx.navigateBack({
      delta: 1
    })
  },
  searchStocks: function (e) {
    let inputVal = e.detail.value
    // stockList
    let stockList = this.data.stockList
    let searchList = []
    if (inputVal === '') {
      this.setData({
        searchList: [{ "stockCode": "A00001", "code": "060001", "stockName": "上证指数", "py": "SZZS", "market": "上指", "type": "" },
        { "stockCode": "A00002", "code": "060002", "stockName": "Ａ股指数", "py": "AGZS", "market": "上指", "type": "" },
        { "stockCode": "A00003", "code": "060003", "stockName": "Ｂ股指数", "py": "BGZS", "market": "上指", "type": "" },
        { "stockCode": "B00001", "code": "060009", "stockName": "深证成指", "py": "SZCZ", "market": "深指", "type": "" },
        { "stockCode": "B00002", "code": "060010", "stockName": "深成指R", "py": "SCZR", "market": "深指", "type": "" },
        { "stockCode": "B00005", "code": "060012", "stockName": "中小板指", "py": "ZXBZ", "market": "深指", "type": "" },
        { "stockCode": "B00006", "code": "060013", "stockName": "创业板指", "py": "CYBZ", "market": "深指", "type": "" }]
      })
    } else {
      for (let i = 0; i < stockList.length; i++) {
        if (stockList[i].stockCode.indexOf(inputVal) > -1 ||
          stockList[i].stockName.indexOf(inputVal) > -1 ||
          stockList[i].py.indexOf(inputVal) > -1 ||
          stockList[i].py.indexOf(inputVal.toUpperCase()) > -1 ||
          stockList[i].py.indexOf(inputVal.toLowerCase()) > -1) {
          searchList.push(stockList[i])
        }
      }
      searchList = searchList.slice(0, 30)
      this.setData({
        searchList
      })
    }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})