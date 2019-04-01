// pages/setting/setting.js
import {
  DBSystem
} from '../../utils/db/DBSystem.js'
import EventBus from '../../utils/pubsub.js'
const app = getApp()
const dbSystem = new DBSystem()

Page({
  data: {
    type: 1,
    tabSelect: 0,
    selectedId: 0,
    selector: []
  },
  onLoad(e) {
    this.setData({
      indicatorSetting: app.globalData.indicatorSetting
    })
  },
  filterNum(value) {
    let num = parseFloat(value)
    if(value.indexOf('.') > 0 || isNaN(num) || num <= 0 || num > 99) {
      wx.showModal({
        title: '提示',
        content: '请输入0-99的整数！',
        success(res) {
          if (res.confirm) {
            return false
          } else if (res.cancel) {
            return false
          }
        }
      })
    } else {
      return true
    }
  },
  inpuParam(e) {
   let key = e.currentTarget.dataset.name
   let input = e.detail.value
   if(this.filterNum(input)) {
    this.data.indicatorSetting[key] = parseInt(input)
   }
   
  },
  radioChange(e) {
    if (e.detail.value == 'closejhjj') {
      this.data.settingItem.jhjj = false
    }
    if (e.detail.value == 'openjhjj') {
      this.data.settingItem.jhjj = true
    }
    if (e.detail.value == 'noshowfsjx') {
      this.data.settingItem.fsjx = false
    }
    if (e.detail.value == 'showfsjx') {
      this.data.settingItem.fsjx = true
    }
    if (e.detail.value == 'noshowfsjlx') {
      this.data.settingItem.fsjlx = false
    }
    if (e.detail.value == 'showfsjlx') {
      this.data.settingItem.fsjlx = true
    }

    if (e.detail.value == 'cq') {
      this.data.settingItem.beforeRf = false
    }
    if (e.detail.value == 'fq') {
      this.data.settingItem.beforeRf = true
    }
    if (e.detail.value == 'ydjx') {
      this.data.settingItem.ydjx.show = true
      this.data.settingItem.cbjx.show = false
    }
    if (e.detail.value == 'cbjx') {
      this.data.settingItem.ydjx.show = false
      this.data.settingItem.cbjx.show = true
    }
    if (e.detail.value == 'noKjx') {
      this.data.settingItem.ydjx.show = false
      this.data.settingItem.cbjx.show = false
    }
    if (e.detail.value == 'ljx') {
      this.data.settingItem.cjljx.show = true
    }
    if (e.detail.value == 'noljx') {
      this.data.settingItem.cjljx.show = false
    }
  },
  ydCheckChange(e) {
    for (let i = 0; i < e.detail.value.length; i++) {
      e.detail.value[i] = +e.detail.value[i]
    }
    this.data.settingItem.ydjx.period = e.detail.value
  },
  cbCheckChange(e) {
    for (let i = 0; i < e.detail.value.length; i++) {
      e.detail.value[i] = +e.detail.value[i]
    }
    this.data.settingItem.cbjx.period = e.detail.value
  },
  cjlCheckChange(e) {
    for (let i = 0; i < e.detail.value.length; i++) {
      e.detail.value[i] = +e.detail.value[i]
    }
    this.data.settingItem.cjljx.period = e.detail.value
  },
  tabSpread(e) {
    if (e.target.dataset.index == this.data.tabSelect) {
      this.setData({
        tabSelect: 0
      })
    } else {
      this.setData({
        tabSelect: e.target.dataset.index
      })
    }
  },
  no() {
    // wx.navigateTo({
    //   url: '../index/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  ok() {
    wx.navigateBack({
      delta: 1
    })
    app.globalData.indicatorSetting = this.data.indicatorSetting
  },
  showPopup() {
    this.popup.showPopup();
  },
  addCustom: function () {
    this.popup.hidePopup();
    let customStockTable = this.data.customStockTable
    let temp = this.data.customStockTable[this.data.selector[this.data.selectedId].name]
    if (temp && temp.indexOf(this.data.stockInfo.stockCode) > -1) {
      wx.showToast({
        title: '已在自选股列表中！',
      })
    } else {
      if (!customStockTable[this.data.selector[this.data.selectedId].name]) {
        customStockTable[this.data.selector[this.data.selectedId].name] = []
      }
      customStockTable[this.data.selector[this.data.selectedId].name].push(this.data.stockInfo.stockCode)
      dbSystem.execSetStorageSync('customStockTable', customStockTable)
      this.setData({
        customStockTable
      })
      wx.showToast({
        title: '添加自选股成功！'
      })
      EventBus.emit('updateOptionStock')
    }
  },
  closePop() {
    this.setData({
      customName: ''
    })
    this.popup.hidePopup();
  },
  bindPickerChange: function (e) {
    this.setData({
      selectedId: e.detail.value
    })
  }
})