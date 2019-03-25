// components/popup/popup.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showHeader: {
      type: Boolean,
      value: true
    },
    showFooter: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: '标题'
    },
    btn_no: {
      type: String,
      value: '取消'
    },
    btn_ok: {
      type: String,
      value: '确定'
    }
  },
  data: {
    flag: true,
  },
  methods: {
    hidePopup: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    showPopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    no() {
      this.triggerEvent("no");
    },
    ok() {
      this.triggerEvent("ok");
    }
  }
})