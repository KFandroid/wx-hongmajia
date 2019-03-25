// components/agentDetail/agentDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    agentData: {
      type: Array,
      value: [],
      observer(newData) {
        for (let i = 0; i < newData.length; i++) {
          newData[i].time = newData[i].time.substring(8, 10) + ':' + newData[i].time.substring(10, 12)
        }
        this.setData({
          data: newData.slice(-4)
        })
      }
    }, 
    pcp: {
      type: Number,
      value: 0,
      observer(newData) {
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})