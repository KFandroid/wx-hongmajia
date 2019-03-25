Page({
  data: {
    index: 0,
    allData: [],
    data: [],
    selector: [],
    selectedCode: null,
    blocklists: [],
    customName: '',
    blockIndex: '',
    counts: []
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('customStockClass')) {
      wx.setStorageSync('customStockClass', [{
        id: +(+new Date() + "").substring(0, 10),
        name: '自选股'
      }])
    }
    this.setData({
      selector: wx.getStorageSync('customStockClass')
    })
    this.popup = this.selectComponent("#popup");
    this.popup2 = this.selectComponent("#popup2");
    let temp = wx.getStorageSync('customStockClass')
    let arr = wx.getStorageSync('customStockTable')
    for (let i = 0; i < temp.length; i++) {
      if (arr.hasOwnProperty(temp[i].name)) {
        this.data.counts.push(arr[temp[i].name].length)
      } else {
        this.data.counts.push(0)
      }
    }
    this.setData({
      counts: this.data.counts
    })
    this.setData({
      blocklists: wx.getStorageSync('customStockClass')
    })
  },
  showPopup() {
    this.popup.showPopup();
  },
  closePop1() {
    this.setData({
      customName: ''
    })
    this.popup.hidePopup();
  },
  closePop2() {
    this.setData({
      customName: '',
      blockIndex: ''
    })
    this.popup2.hidePopup();
  },
  addCustom() {
    if (this.data.customName == '') {
      wx.showToast({
        title: '板块名为空',
        icon: 'error'
      })
    } else {
      this.popup.hidePopup();
      let temp = wx.getStorageSync('customStockClass')
      let flag = true
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].name == this.data.customName) {
          flag = false
        }
      }
      if (flag) {
        temp.push({
          name: this.data.customName,
          id: +(+new Date() + "").substring(0, 10),
        })
        let customStockTable = wx.getStorageSync('customStockTable')
        customStockTable[this.data.customName] = []
        wx.setStorageSync('customStockTable', customStockTable)
        this.data.counts.push(0)
        this.setData({
          counts: this.data.counts
        })
      } else {
        wx.showToast({
          title: '已有同名自选股板块',
          icon: 'error'
        })
      }
      wx.setStorageSync('customStockClass', temp)
      this.setData({
        blocklists: temp,
        customName: ''
      })
    }
  },
  nameInput(e) {
    this.setData({
      customName: e.detail.value
    })
  },
  deleteItem(e) {
    let temp = wx.getStorageSync('customStockClass')
    let name = ''
    for (let i = 0; i < temp.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        name = temp[i].name
        temp.splice(i, 1)
      }
    }
    wx.setStorageSync('customStockClass', temp)
    let customStockTable = wx.getStorageSync('customStockTable')
    if (customStockTable[name]) {
      delete customStockTable[name]
      wx.setStorageSync('customStockTable', customStockTable)
    }
    if (wx.removeStorageSync('1070000000000000000000000000000000000000' + name)) {
      wx.removeStorageSync('1070000000000000000000000000000000000000' + name)
    }
    this.data.counts.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      blocklists: temp,
      customName: '',
      counts: this.data.counts
    })
  },
  openEditPop(e) {
    this.popup2.showPopup();
    this.setData({
      blockIndex: e.currentTarget.dataset.index,
      customName: wx.getStorageSync('customStockClass')[e.currentTarget.dataset.index].name
    })
  },
  editCustom() {
    let name = ''
    this.popup2.hidePopup();
    let temp = wx.getStorageSync('customStockClass')
    for (let i = 0; i < temp.length; i++) {
      if (i == this.data.blockIndex) {
        name = temp[i].name
        temp[i].name = this.data.customName
      }
    }
    wx.setStorageSync('customStockClass', temp)
    let customStockTable = wx.getStorageSync('customStockTable')
    if (customStockTable[name]) {
      customStockTable[this.data.customName] = customStockTable[name]
      delete customStockTable[name]
      wx.setStorageSync('customStockTable', customStockTable)
    }
    if (wx.removeStorageSync('1070000000000000000000000000000000000000' + name)) {
      wx.setStorageSync('1070000000000000000000000000000000000000' + this.data.customName, wx.getStorageSync('1070000000000000000000000000000000000000' + name))
      wx.removeStorageSync('1070000000000000000000000000000000000000' + name)
    }
    this.setData({
      blocklists: temp,
      customName: '',
      blockIndex: ''
    })
  },
  removeThis(detail) {
    this.setData({
      selectedCode: detail.currentTarget.dataset.item.stockCode
    })
    wx.showModal({
      title: '提示',
      content: '是否确认删除该自选股',
      success: res => {
        if (res.confirm) {
          let temp = wx.getStorageSync('customStockTable')
          temp[this.data.selector[this.data.index].name] = wx.getStorageSync('customStockTable')[this.data.selector[this.data.index].name].filter(item => {
            return item !== this.data.selectedCode
          })
          wx.setStorageSync('customStockTable', temp)
          getK107()
        }
      }
    })
  }
})