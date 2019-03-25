// components/stockInfo/stockInfo.js
import {
  DBSystem
} from '../../utils/db/DBSystem.js'
import EventBus from '../../utils/pubsub.js'
import WXStorage from '../../utils/WXStorage.js'
import { connect } from "../../utils/socket"
const dbSystem = new DBSystem()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stockInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selector: [],
    selectedId: 0
  },
  lifetimes: {
    attached() {
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

      let customStockTable = dbSystem.getDataByKey('customStockTable', {
        defaultValue: {}
      })
      this.setData({
        customStockTable
      })
    }
  },
  methods: {
    showPopup() {
      this.popup.showPopup();
    },
    addCustom: function () {
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
  }
})
