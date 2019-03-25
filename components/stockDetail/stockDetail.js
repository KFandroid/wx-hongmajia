// components/stockDetail/stockDetail.js
const addZero = function(code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stockDetailData: {
      type: Object,
      value: null,
      observer(newData, oldData) {
        if (!this.data.itemArr) {
          this.getItem()
        }
        let data = newData.data
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.data.itemArr.length; j++) {
            if (data[i].cno == this.data.itemArr[j].cno) {
              data[i].name = this.data.itemArr[j].name
              data[i].cname = this.data.itemArr[j].cname
              data[i].keyName = this.data.itemArr[j].keyName
            }
          }
        }
        if (newData.data) {
          this.setData({
            data: newData.data.reverse(),
            currentPage: parseInt(newData.page),
            totalPage: +newData.totalPage,
            selectStock: wx.getStorageSync('selectStock')
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: null,
    itemArr: null,
    currentPage: null,
    totalPage: null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getItem() {
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
      this.data.itemArr = itemArr
    }
  },
  pageUp() {
    this.data.currentPage--
      this.triggerEvent('getNewStockDetail', this.data.currentPage)
  },
  pageDown() {
    this.data.currentPage--
      this.triggerEvent('getNewStockDetail', this.data.currentPage)
  }
})