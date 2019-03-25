// components/bestSelect/bestSelect.js
const util = require('../../utils/util.js')
const app = getApp()
import EventBus from '../../utils/pubsub.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bestSelectData: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let temp = {}
        for (let i = 0; i < data.length; i++) {
          temp[data[i].no] = data[i].value
        }
        this.setData({
          tableData: temp
        })
      }
    },
    t120: {
      type: Object,
      value: null,
      observer(newData) {
        let data = newData.data
        let k105 = app.globalData.a105.data
        for (let i = 0; i < k105.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (k105[i].stockCode == data[j].stockCode) {
              data[j].stockName = k105[i].stockName
            }
          }
        }
        for (let i = 0; i < data.length; i++) {
          data[i].zf = (((data[i].cjj - data[i].zs) / data[i].zs) * 100).toFixed(2)
        }
        this.setData({
          data,
          currentPage: +newData.totalPage - +newData.page + 1,
          totalPage: +newData.totalPage
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
    pickerArr: [{
      no: '1',
      name: '缺口',
      children: [{
        cno: 1,
        cname: '向上跳空缺口'
      }, {
        cno: 2,
        cname: '向上偏离延伸'
      }, {
        cno: 3,
        cname: '向下跳空缺口'
      }, {
        cno: 4,
        cname: '向下偏离延伸'
      },]
    }, {
      no: '2',
      name: '行情',
      children: [{
        cno: 1,
        cname: '竞价放量'
      }, {
        cno: 2,
        cname: '高开'
      }, {
        cno: 3,
        cname: '低开'
      }, {
        cno: 4,
        cname: '开盘放量'
      }, {
        cno: 6,
        cname: '尾盘放量'
      }]
    }, {
      no: '5',
      name: '涨停',
      children: [{
        cno: 1,
        cname: '普通涨停'
      }, {
        cno: 2,
        cname: '缺口涨停'
      }, {
        cno: 3,
        cname: 'T字涨停'
      }, {
        cno: 4,
        cname: '一字涨停'
      }]
    }, {
      no: '6',
      name: '跌停',
      children: [{
        cno: 1,
        cname: '普通跌停'
      }, {
        cno: 2,
        cname: '缺口跌停'
      }, {
        cno: 3,
        cname: '倒T跌停'
      }, {
        cno: 4,
        cname: '一字跌停'
      }]
    }, {
      no: '7',
      name: '影线',
      children: [{
        cno: 1,
        cname: '长上影线'
      }, {
        cno: 2,
        cname: '长下影线'
      }]
    }],
    date: util.formatTimeYmd(new Date()),
    selectNo: null,
    tableData: null,
    title: '',
    scrollTop: 0,
    selected: null,
    showDetail: false,
    data: [],
    currentPage: null,
    totalPage: null,
    subTitle: '',
    secondDays: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeStockAndStockList(e) {
      let index = e.currentTarget.dataset.index
      let stockTable = this.data.data
      let stock = stockTable[index]
      let stockList = app.globalData.a105.data
      for(let i = 0; i < stockList.length; i++) {
        for(let j = 0; j < stockTable.length; j++) {
          if(stockTable[j].stockCode === stockList[i].stockCode) {
            stockTable[j].code = stockList[i].code
          }
        }
        
      }
      EventBus.emit('changeStockAndStockList', {stock, stockList: stockTable})
    },
    bindGetDate(e) {
      this.setData({
        date: e.detail
      })
    },
    openTable(e) {
      let cno = e.currentTarget.dataset.index
      this.setData({
        selectNo: cno,
        title: e._relatedInfo.anchorTargetText,
        itemCode: this.data.selected + cno,
        isYS: e._relatedInfo.anchorTargetText.indexOf('延伸') > -1
      })
      this.triggerEvent('getBestSelect', {
        no: this.data.selected,
        cno: this.data.selectNo,
        date: this.data.date
      })
    },
    closeTable() {
      this.setData({
        selectNo: null,
        tableData: null,
        title: ''
      })
    },
    selectIt(e) {
      if (this.data.selected) {
        this.setData({
          selected: null
        })
      } else {
        this.setData({
          selected: e.currentTarget.dataset.index
        })
      }
    },
    showDetailCtrl(e) {
      this.setData({
        showDetail: true,
        itemCode2: e.currentTarget.dataset.index,
        subTitle: e.currentTarget.dataset.title
      })
      this.triggerEvent('getK120', {
        itemCode: this.data.itemCode,
        itemCode2: e.currentTarget.dataset.index,
        date: this.data.date,
      })
    },
    closeDetail() {
      this.setData({
        showDetail: false
      })
    },
    pageUp() {
      this.setData({
        currentPage: this.data.currentPage - 1,
        scrollTop: 0
      })
      this.triggerEvent('getK120', {
        itemCode: this.data.itemCode,
        itemCode2: this.data.itemCode2,
        date: this.data.date,
        currentPage: this.data.totalPage - this.data.currentPage + 1
      })
    },
    pageDown() {
      this.setData({
        currentPage: this.data.currentPage + 1,
        scrollTop: 0
      })
      this.triggerEvent('getK120', {
        itemCode: this.data.itemCode,
        itemCode2: this.data.itemCode2,
        date: this.data.date,
        currentPage: this.data.totalPage - this.data.currentPage + 1
      })
    }
  }
})