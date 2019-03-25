// components/dataBank/dataBank.js
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
      observer() {
        
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: [
      {name: '涨跌', data: ''},
      {name: '振幅', data: ''},
      {name: '量比', data: ''},
      {name: '换手', data: ''},
      {name: '净资产', data: ''},
      {name: '市净率', data: ''},
      {name: '总股本', data: ''},
      {name: '流通A股', data: ''},
      {name: '总市值', data: ''},
      {name: '流通值', data: ''}
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})