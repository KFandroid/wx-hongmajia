// components/headMenu/headMenu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    menuShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showMenu() {
      this.setData({
        menuShow: !this.data.menuShow
      })
    },
    navToCustomStock() {
      wx.navigateTo({
        url: `../customStock/customStock`,
      })
      this.setData({
        menuShow: false
      })
    },
  }
})
