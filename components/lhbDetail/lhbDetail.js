// components/lhbDetail/lhbDetail.js
const util = require('../../utils/util.js')
const allyyb = require('../../utils/data/longhubang.js')
import {
  getNumUnit
} from '../../utils/changeUnit.js'

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    t134: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let k105 = app.globalData.k105.data
        for (let i = 0; i < k105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (k105[i].stockCode == data[j].stockCode) {
              data[j].stockName = k105[i].stockName
            }
          }
        }
        this.data.trueData = newData.data
        this.initShowData()
      }
    },
    t136: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < allyyb.length; j++) {
            data[i].cz = getNumUnit((+data[i].buy - +data[i].sell).toFixed(2))
            data[i].cb = ((+data[i].buy - +data[i].sell).toFixed(2) / (+data[i].buy + +data[i].sell) * 100).toFixed(2) + '%'
            data[i].buy = getNumUnit(data[i].buy)
            data[i].sell = getNumUnit(data[i].sell)
            if (data[i].id == allyyb[j].id) {
              data[i].name = allyyb[j].name
              break;
            }
          }
        }
        this.data.trueYYBData = data
        this.initshowYYBData()
      }
    },
    t137: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let k105 = app.globalData.k105.data
        for (let i = 0; i < k105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (k105[i].stockCode == data[j].stockCode) {
              data[j].stockName = k105[i].stockName
            }
          }
        }
        for (let i = 0; i < data.length; i++) {
          data[i].zf = (((data[i].cjj - data[i].zsj) / data[i].zsj) * 100).toFixed(2)
          data[i].zl = getNumUnit((+data[i].buy + +data[i].sell).toFixed(2))
          data[i].zzb = (((+data[i].buy + +data[i].sell).toFixed(2) / data[i].volume) * 100).toFixed(2) + '%'
        }
        this.setData({
          showDetailData: data
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    date: util.formatTimeYmd(new Date() - (24 * 60 * 60 * 1000)),
    // new Date() - (24 * 60 * 60 * 1000)
    selected: 1,
    showTwo: false,
    selector: [{
      value: 'aos',
      name: '全部机构及营业部'
    }, {
      value: 'os',
      name: '机构专用'
    }, {
      value: 'hk',
      name: '沪股通及深股通'
    }, {
      value: 'dp',
      name: '全部营业部'
    }, {
      value: 'm50',
      name: '月度知名营业部'
    }, {
      value: 'y50',
      name: '年度知名营业部'
    }],
    selectIndex: 0,
    selectIndexTemp: 0,
    trueData: null,
    showData: null,
    trueYYBData: null,
    showYYBData: null,
    showDetailData: null,
    title: ''
  },
  lifetimes: {
    attached() {
      this.popup = this.selectComponent("#popup")
      this.triggerEvent('getK134', {
        date: this.data.date
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initShowData() {
      let arr = []
      let flag = this.data.selector[this.data.selectIndex].value
      for (let i = 0; i < this.data.trueData.length; i++) {
        let obj = {}
        obj.stockCode = this.data.trueData[i].stockCode
        obj.stockName = this.data.trueData[i].stockName
        obj.zf = (((this.data.trueData[i].price - this.data.trueData[i].zsj) / this.data.trueData[i].zsj) * 100).toFixed(2) + '%'
        obj.price = this.data.trueData[i].price
        if (flag == 'aos') {
          obj.buy = this.data.trueData[i].qbBuy
          obj.sell = this.data.trueData[i].qbSell
        }
        else if (flag == 'os') {
          obj.buy = this.data.trueData[i].jgBug
          obj.sell = this.data.trueData[i].jgSell
        }
        else if (flag == 'hk') {
          obj.buy = this.data.trueData[i].hgtBuy
          obj.sell = this.data.trueData[i].hgtSell
        }
        else if (flag == 'dp') {
          obj.buy = this.data.trueData[i].allyybBuy
          obj.sell = this.data.trueData[i].allyybSell
        }
        else if (flag == 'm50') {
          obj.buy = this.data.trueData[i].monthyybBuy
          obj.sell = this.data.trueData[i].monthyybSell
        }
        else if (flag == 'y50') {
          obj.buy = this.data.trueData[i].yearyybBuy
          obj.sell = this.data.trueData[i].yearyybSell
        }
        obj.zl = getNumUnit((+obj.buy + +obj.sell).toFixed(2))
        obj.zzb = (((+obj.buy + +obj.sell).toFixed(2) / +this.data.trueData[i].volume) * 100).toFixed(2) + '%'
        obj.buy = getNumUnit(obj.buy)
        obj.sell = getNumUnit(obj.sell)
        arr.push(obj)
      }
      this.setData({
        showData: arr
      })
    },
    initshowYYBData() {
      let arr = []
      let flag = this.data.selector[this.data.selectIndex].value
      for (let i = 0; i < this.data.trueYYBData.length; i++) {
        if (flag == 'aos' && this.data.trueYYBData[i].all == 1) {
          arr.push(this.data.trueYYBData[i])
        }
        else if (flag == 'os' && this.data.trueYYBData[i].jg == 1) {
          arr.push(this.data.trueYYBData[i])
        }
        else if (flag == 'hk' && this.data.trueYYBData[i].hgt == 1) {
          arr.push(this.data.trueYYBData[i])
        }
        else if (flag == 'dp' && this.data.trueYYBData[i].yyb == 1) {
          arr.push(this.data.trueYYBData[i])
        }
        else if (flag == 'm50' && this.data.trueYYBData[i].month == 1) {
          arr.push(this.data.trueYYBData[i])
        }
        else if (flag == 'y50' && this.data.trueYYBData[i].year == 1) {
          arr.push(this.data.trueYYBData[i])
        }
      }
      this.setData({
        showYYBData: arr
      })
    },
    bindGetDate(e) {
      this.setData({
        date: e.detail
      })
      if (this.data.selected == 1) {
        this.triggerEvent('getK134', {
          date: e.detail
        })
        this.setData({
          showData: null
        })
      } else if (this.data.selected == 2) {
        this.triggerEvent('getK136', {
          date: e.detail
        })
        this.setData({
          showYYBData: null
        })
      }
    },
    tabChange(e) {
      this.setData({
        selected: e.currentTarget.dataset.index
      })
      if (this.data.selected == 2 && !this.data.showYYBData) {
        this.triggerEvent('getK136', {
          date: this.data.date
        })
      }
    },
    openTwo(e) {
      this.setData({
        showTwo: true,
        title: e.currentTarget.dataset.name
      })
      this.triggerEvent('getK137', {
        date: this.data.date,
        code: e.currentTarget.dataset.id
      })
    },
    closeTwo() {
      this.setData({
        showTwo: false
      })
    },
    bindPickerChange(e) {
      this.setData({
        index: e.detail.value
      })
    },
    openDialog() {
      this.popup.showPopup()
      this.setData({
        selectIndexTemp: this.data.selectIndex
      })
    },
    dialogNo() {
      this.popup.hidePopup()
    },
    dialogYes() {
      this.popup.hidePopup()
      this.setData({
        selectIndex: this.data.selectIndexTemp
      })
      this.initShowData()
      this.initshowYYBData()
    },
    settingChange(e) {
      this.setData({
        selectIndexTemp: e.currentTarget.dataset.index
      })
    }
  }
})