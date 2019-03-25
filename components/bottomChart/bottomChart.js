// components/bottomChart/bottomChart.js
Component({
  data: {},
  ready() {
    const context = wx.createCanvasContext('myCanvas', this)
    context.draw()
  },
  methods: {}
})