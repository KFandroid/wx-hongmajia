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
    items: {
      jhjjItems: [
        { name: '关闭', value: 'closejhjj', checked: true },
        { name: '打开', value: 'openjhjj', checked: false }
      ],
      fsjxItems: [
        { name: '不显示', value: 'noshowfsjx', checked: true },
        { name: '显示', value: 'showfsjx', checked: false }
      ],
      fsjlxItems: [
        { name: '不显示', value: 'noshowfsjlx', checked: true },
        { name: '显示', value: 'showfsjlx', checked: false }
      ],
      cfqItems: [
        { name: '除权状态', value: 'cq', checked: false },
        { name: '复权状态', value: 'fq', checked: true }
      ],
      kjxItems: [
        { name: '移动均线', value: 'ydjx', checked: true },
        { name: '成本均线', value: 'cbjx', checked: false },
        { name: '不显示', value: 'noKjx', checked: false }
      ],
      kydjxPeriod: [
        { name: '5', checked: true },
        { name: '10', checked: true },
        { name: '20', checked: false },
        { name: '30', checked: false },
        { name: '60', checked: false }
      ],
      kcbjxPeriod: [
        { name: '5', checked: true },
        { name: '10', checked: true },
        { name: '20', checked: false },
        { name: '30', checked: false },
        { name: '60', checked: false }
      ],
      ljxItems: [
        { name: '量均线', value: 'ljx', checked: false },
        { name: '不显示', value: 'noljx', checked: true }
      ],
      kcjljxPeriod: [
        { name: '5', checked: true },
        { name: '10', checked: true },
        { name: '20', checked: false },
        { name: '30', checked: false },
        { name: '60', checked: false }
      ]
    },
    settingItem: {
      jhjj: false,
      fsjx: false,
      fsjlx: false,
      ydjx: {
        show: true,
        period: [5, 10]
      },
      cbjx: {
        show: false,
        period: [5, 10]
      },
      cjljx: {
        show: true,
        period: [5, 10]
      },
      beforeRf: true,
      selector: []
    },
    selectedId: 0,
    selector: []
  },
  onLoad(e) {
    if (wx.getStorageSync('settingItem')) {
      app.globalData.settingItem = wx.getStorageSync('settingItem')
    }
    this.setData({
      type: +e.type,
      settingItem: app.globalData.settingItem
    })
    this.data.items.kydjxPeriod[0].checked = false
    this.data.items.kydjxPeriod[1].checked = false
    this.data.items.kydjxPeriod[2].checked = false
    this.data.items.kydjxPeriod[3].checked = false
    this.data.items.kydjxPeriod[4].checked = false
    this.data.items.kcbjxPeriod[0].checked = false
    this.data.items.kcbjxPeriod[1].checked = false
    this.data.items.kcbjxPeriod[2].checked = false
    this.data.items.kcbjxPeriod[3].checked = false
    this.data.items.kcbjxPeriod[4].checked = false
    this.data.items.kcjljxPeriod[0].checked = false
    this.data.items.kcjljxPeriod[1].checked = false
    this.data.items.kcjljxPeriod[2].checked = false
    this.data.items.kcjljxPeriod[3].checked = false
    this.data.items.kcjljxPeriod[4].checked = false
    let settingItem = app.globalData.settingItem
    for (let i = 0; i < settingItem.ydjx.period.length; i++) {
      this.data.items.kydjxPeriod[i].name = settingItem.ydjx.period[i] + ''
      this.data.items.kydjxPeriod[i].checked = true
    }
    for (let i = 0; i < settingItem.cbjx.period.length; i++) {
      this.data.items.kcbjxPeriod[i].name = settingItem.cbjx.period[i] + ''
      this.data.items.kcbjxPeriod[i].checked = true
    }
    for (let i = 0; i < settingItem.cjljx.period.length; i++) {
      this.data.items.kcjljxPeriod[i].name = settingItem.cjljx.period[i] + ''
      this.data.items.kcjljxPeriod[i].checked = true
    }
    if (settingItem.jhjj == false) {
      this.data.items.jhjjItems[0].checked = true
      this.data.items.jhjjItems[1].checked = false
    } else {
      this.data.items.jhjjItems[0].checked = false
      this.data.items.jhjjItems[1].checked = true
    }
    if (settingItem.fsjx == false) {
      this.data.items.fsjxItems[0].checked = true
      this.data.items.fsjxItems[1].checked = false
    } else {
      this.data.items.fsjxItems[0].checked = false
      this.data.items.fsjxItems[1].checked = true
    }
    if (settingItem.fsjlx == false) {
      this.data.items.fsjlxItems[0].checked = true
      this.data.items.fsjlxItems[1].checked = false
    } else {
      this.data.items.fsjlxItems[0].checked = false
      this.data.items.fsjlxItems[1].checked = true
    }
    if (settingItem.beforeRf == true) {
      this.data.items.cfqItems[0].checked = false
      this.data.items.cfqItems[1].checked = true
    } else {
      this.data.items.cfqItems[0].checked = true
      this.data.items.cfqItems[1].checked = false
    }
    if (settingItem.ydjx.show == true) {
      this.data.items.kjxItems[0].checked = true
      this.data.items.kjxItems[1].checked = false
      this.data.items.kjxItems[2].checked = false
    }
    if (settingItem.cbjx.show == true) {
      this.data.items.kjxItems[0].checked = false
      this.data.items.kjxItems[1].checked = true
      this.data.items.kjxItems[2].checked = false
    }
    if (settingItem.ydjx.show == false && settingItem.cbjx.show == false) {
      this.data.items.kjxItems[0].checked = false
      this.data.items.kjxItems[1].checked = false
      this.data.items.kjxItems[2].checked = true
    }
    if (settingItem.cjljx.show == true) {
      this.data.items.ljxItems[0].checked = true
      this.data.items.ljxItems[1].checked = false
    }
    this.setData({
      items: this.data.items
    })

    if (!wx.getStorageSync('customStockClass')) {
      wx.setStorageSync('customStockClass', [{
        id: +(+new Date() + "").substring(0, 10),
        name: '自选股'
      }])
    }
    let selector = wx.getStorageSync('customStockClass')
    let stockInfo = wx.getStorageSync('selectStock')
    this.setData({
      selector,
      stockInfo
    })
    this.popup = this.selectComponent("#popup");

    let customStockTable = dbSystem.getDataByKey('customStockTable', {
      defaultValue: {}
    })
    this.setData({
      customStockTable
    })
  },
  bindinput(e) {
    this.data.items[e.currentTarget.dataset.flag][e.currentTarget.dataset.index].name = e.detail.value
    let arr = []
    for (let i = 0; i < this.data.items[e.currentTarget.dataset.flag].length; i++) {
      if (this.data.items[e.currentTarget.dataset.flag][i].checked == true) {
        arr.push(+this.data.items[e.currentTarget.dataset.flag][i].name)
      }
    }
    if (e.currentTarget.dataset.flag == 'kydjxPeriod') {
      this.data.settingItem.ydjx.period = arr
    }
    if (e.currentTarget.dataset.flag == 'kcbjxPeriod') {
      this.data.settingItem.cbjx.period = arr
    }
    if (e.currentTarget.dataset.flag == 'kcjljxPeriod') {
      this.data.settingItem.cjljx.period = arr
    }
    this.setData({
      items: this.data.items,
      settingItem: this.data.settingItem
    })
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
    for (let i = 0; i < this.data.items.kydjxPeriod.length; i++) {
      this.data.items.kydjxPeriod[i].checked = false
    }
    for (let i = 0; i < e.detail.value.length; i++) {
      let index = e.detail.value[i].split(',')[0]
      let value = e.detail.value[i].split(',')[1]
      this.data.items.kydjxPeriod[index].checked = true
      e.detail.value[i] = +e.detail.value[i]
    }
    this.setData({
      items: this.data.items
    })
    this.data.settingItem.ydjx.period = e.detail.value
  },
  cbCheckChange(e) {
    for (let i = 0; i < this.data.items.kcbjxPeriod.length; i++) {
      this.data.items.kcbjxPeriod[i].checked = false
    }
    for (let i = 0; i < e.detail.value.length; i++) {
      let index = e.detail.value[i].split(',')[0]
      let value = e.detail.value[i].split(',')[1]
      this.data.items.kcbjxPeriod[index].checked = true
      e.detail.value[i] = +e.detail.value[i]
    }
    this.setData({
      items: this.data.items
    })
    this.data.settingItem.cbjx.period = e.detail.value
  },
  cjlCheckChange(e) {
    for (let i = 0; i < this.data.items.kcjljxPeriod.length; i++) {
      this.data.items.kcjljxPeriod[i].checked = false
    }
    for (let i = 0; i < e.detail.value.length; i++) {
      let index = e.detail.value[i].split(',')[0]
      let value = e.detail.value[i].split(',')[1]
      this.data.items.kcjljxPeriod[index].checked = true
      e.detail.value[i] = +e.detail.value[i]
    }
    this.setData({
      items: this.data.items
    })
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
    app.globalData.settingItem = this.data.settingItem
    wx.setStorageSync('settingItem', this.data.settingItem)
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