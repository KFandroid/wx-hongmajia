// components/pagination/pagination.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalPage: {
      type: Number,
      value: 0
    },
    currentPage: {
      type: Number,
      value:0
    },
    heightNum: {
      type: Number,
      value: 80
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentPage: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pageUp: function(){
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('pageup', myEventDetail, myEventOption)
      wx.showToast({
        title:'向上翻页！！！',
        icon:'success'
      })
    },
    pageDown: function () {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('pagedown', myEventDetail, myEventOption)
      wx.showToast({
        title: '向下翻页！！！',
        icon: 'success'
      })
    }
  }
})
