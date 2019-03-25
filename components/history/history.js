// components/history/history.js
const allyyb = require('../../utils/data/longhubang.js')
import {
  getNumUnit
} from '../../utils/changeUnit.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    t138: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        for (let i = 0; i < data.length; i++) {
          data[i].zl = getNumUnit((+data[i].qbBuy + +data[i].qbSell).toFixed(2))
          data[i].zzb = (((+data[i].qbBuy + +data[i].qbSell).toFixed(2) / data[i].volume) * 100).toFixed(2) + '%'

          data[i].qbBuy = getNumUnit(data[i].qbBuy)
          data[i].qbSell = getNumUnit(data[i].qbSell)
        }
        this.setData({
          showData: data
        })
      }
    },
    t139: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        for (let i = 0; i < data.length; i++) {
          data[i].zl = getNumUnit((+data[i].buy + +data[i].sell).toFixed(2))
          data[i].zzb = (((+data[i].buy + +data[i].sell).toFixed(2) / data[i].volume) * 100).toFixed(2) + '%'
          for (let j = 0; j < allyyb.length; j++) {
            if (data[i].id == allyyb[j].id) {
              data[i].name = allyyb[j].name
              break;
            }
          }
          data[i].buy = getNumUnit(data[i].buy)
          data[i].sell = getNumUnit(data[i].sell)
        }
        this.setData({
          showDataTwo: data
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTwo: false,
    showData: [],
    showDataTwo: [],
    selectStock: null
  },
  lifetimes: {
    attached() {
      this.triggerEvent('getK138')
      this.setData({
        selectStock: wx.getStorageSync("selectStock")
      })
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        selectStock: wx.getStorageSync("selectStock")
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    openTwo(e) {
      this.setData({
        showTwo: true,
        selectDate: e.currentTarget.dataset.date
      })
      this.triggerEvent('tabUse', false)
      this.triggerEvent('getK139', {
        date: e.currentTarget.dataset.date
      })
    },
    closeTwo() {
      this.setData({
        showTwo: false
      })
      this.triggerEvent('tabUse', true)
    }
  }
})