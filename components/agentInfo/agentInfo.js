// components/agentInfo/agentInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lineHeight: {
      type: Number,
      value: 40
    },
    agentData: {
      type: Object,
      value: {

      },
      observer(newData) {
        let buyData = []
        let saleData = []
        let data = newData.data
        if(data) {
          for(let i = 0, length = data.length; i < length; i++) {
            if(data[i].title.match(/^s/i)) {
              data[i].title = data[i].title.replace(/^s(\d{1})/i, "卖$1")
              if(parseInt(data[i].num) === 0) {
                data[i].num = '-'
              }
              buyData.unshift(data[i])
            } else if (data[i].title.match(/^b/i)) {
              data[i].title = data[i].title.replace(/^b(\d{1})/i, "买$1")
              if(parseInt(data[i].num) === 0) {
                data[i].num = '-'
              }
              saleData.push(data[i])
            }
          }
          let dataTmpl = (index, title) => {
            return {
              title: title + index,
              price: '-',
              num: '-'
            }
          }
          for(let i = saleData.length + 1; i <= 5; i++) {
            saleData.push(dataTmpl(i, '买'))
          }
          for(let i = buyData.length + 1; i <= 5; i++) {
            buyData.unshift(dataTmpl(i, '卖'))
          }
          this.setData({
            saleData,
            buyData,
            pcp: newData.pcp
          })
        }
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    saleData: [],
    buyData: [],
    pcp: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
