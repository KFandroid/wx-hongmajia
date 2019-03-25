const util = require('../../utils/util.js')
import EventBus from '../../utils/pubsub.js'
import {
  recordTime
} from '../../utils/record.js'
import {
  formatDate
} from '../../utils/util.js'
const app = getApp()
const today = formatDate(new Date())
Component({
  properties: {
    t101: {
      type: Object,
      value: null,
      observer(data) {
        this.initTree()
      }
    },
    t102: {
      type: Object,
      value: null,
      observer(data) {
        this.initChild()
      }
    },
    t106: {
      type: Object,
      value: null,
      observer(data) {
        this.initTree()
      }
    },
    t103: {
      type: Object,
      value: null,
      observer(data) {
        let a103 = data
        let a105 = app.globalData.a105
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
            detailData: tree,
            currentPage: +data.page,
            totalPage: +data.totalPage
          })
        }
      }
    }
  },
  data: {
    childOneShow: -1,
    childTwoShow: -1,
    childThreeShow: -1,
    date: util.formatTimeYmd(new Date()),
    tree: [],
    selectIndex: -1,
    detailData: null,
    title: "",
    currentPage: null,
    totalPage: null,
    sortCode: '0050',
    today,
    showDetail: false
  },
  lifetimes: {
    detached() {
      // this.triggerEvent('stopGetK103')
    }
  },
  methods: {
    changeStockAndStockList(e) {
      let index = e.currentTarget.dataset.index
      let stock = this.data.detailData[index]
      let stockList = this.data.detailData
      EventBus.emit('changeStockAndStockList', {stock, stockList})
    },
    initTree() {
      if (this.data.t106) {
        let tree = this.data.t106.data
        if (this.data.t101) {
          for (let i = 0; i < tree.length; i++) {
            if (this.data.t101) {
              for (let j = 0; j < this.data.t101.data.length; j++) {
                if (tree[i].no === this.data.t101.data[j].no) {
                  tree[i].count = this.data.t101.data[j].count
                  tree[i].quit = this.data.t101.data[j].quit
                  tree[i].increase = this.data.t101.data[j].increase
                  tree[i].decrease = this.data.t101.data[j].decrease
                }
              }
            }
            if (this.data.selectIndex !== -1) {
              let child = tree[this.data.selectIndex].children
              if (this.data.t102) {
                for (let i = 0; i < child.length; i++) {
                  for (let j = 0; j < this.data.t102.data.length; j++) {
                    if (child[i].cno === this.data.t102.data[j].no) {
                      child[i].quit = this.data.t102.data[j].quit
                      child[i].count = this.data.t102.data[j].count
                      child[i].decrease = this.data.t102.data[j].decrease
                      child[i].increase = this.data.t102.data[j].increase
                    }
                  }
                }
              }
            }
          }
        }
        this.setData({
          tree: tree
        })
      }
    },
    initChild() {
      if (this.data.selectIndex !== -1) {
        let tree = JSON.parse(JSON.stringify(this.data.tree))
        let child = tree[this.data.selectIndex].children
        if (this.data.t102) {
          for (let i = 0; i < child.length; i++) {
            for (let j = 0; j < this.data.t102.data.length; j++) {
              if (child[i].cno === this.data.t102.data[j].no) {
                child[i].quit = this.data.t102.data[j].quit
                child[i].count = this.data.t102.data[j].count
                child[i].decrease = this.data.t102.data[j].decrease
                child[i].increase = this.data.t102.data[j].increase
              }
            }
          }
          this.setData({
            tree: tree
          })
        }
      }
    },
    showChildOne(e) {
      let no = e.target.dataset.no
      if (no === this.data.childOneShow) {
        this.setData({
          childTwoShow: false,
          childOneShow: -1,
          childThreeShow: -1,
          t102: null,
          selectIndex: -1
        })
        this.triggerEvent('closeGetChild')
      } else {
        this.setData({
          childTwoShow: false,
          childOneShow: no,
          childThreeShow: -1,
          selectIndex: e.target.dataset.index
        })
        this.triggerEvent('getChild', e.target.dataset.no)
      }
    },
    showChildTwo(e) {
      let no = e.target.dataset.no
      if (no === this.data.childTwoShow) {
        this.setData({
          childOneShow: false,
          childTwoShow: -1,
          childThreeShow: -1
        })
      } else {
        this.setData({
          childOneShow: false,
          childTwoShow: no,
          childThreeShow: -1
        })
      }
    },
    showChildThree(e) {
      let no = e.target.dataset.cno
      if (no === this.data.childThreeShow) {
        this.setData({
          childThreeShow: -1
        })
      } else {
        this.setData({
          childThreeShow: no
        })
      }
    },
    navigateToTable(e) {
      let cno = e.target.dataset.cno
      let name = e.target.dataset.name
      let date = this.properties.date
      let code = util.addZero('' + this.data.childOneShow, 3) + util.addZero('' + cno, 3)
      this.setData({
        title: e.target.dataset.name,
        cnoTemp: cno,
        codeTemp: code,
        showDetail: true
      })
      this.triggerEvent('getK103', {
        cno,
        code
      })
    },
    bindGetDate(e) {
      this.setData({
        childOneShow: -1,
        childTwoShow: -1,
        childThreeShow: -1,
        date: e.detail,
        tree: []
      })
      this.triggerEvent('dateChange', e.detail)
    },
    closeDetail() {
      this.setData({
        detailData: null,
        title: "",
        currentPage: null,
        totalPage: null,
        sortCode: '0050',
        showDetail: false
      })
      this.triggerEvent('stopGetK103')
    },
    pageUp() {
      this.data.currentPage = this.data.currentPage - 1
      this.setData({
        currentPage: this.data.currentPage
      })
      this.triggerEvent('getK103', {
        cno: this.data.cnoTemp,
        code: this.data.codeTemp,
        page: this.data.currentPage,
        sort: this.data.sortCode
      })
    },
    pageDown() {
      this.data.currentPage = this.data.currentPage + 1
      this.setData({
        currentPage: this.data.currentPage
      })
      this.triggerEvent('getK103', {
        cno: this.data.cnoTemp,
        code: this.data.codeTemp,
        page: this.data.currentPage,
        sort: this.data.sortCode
      })
    },
    changeSort: function(e) {
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
      this.triggerEvent('getK103', {
        cno: this.data.cnoTemp,
        code: this.data.codeTemp,
        page: this.data.currentPage,
        sort: this.data.sortCode
      })
    }
  }
})