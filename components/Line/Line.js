// components/Line/Line.js
import EventBus from '../../utils/pubsub.js'
import debounce from '../../utils/debounce.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,
      value: 300,
      observer(newData) {
        this.data.yRange = [0, newData]
        this.doDraw()
      }
    },
    colors: {
      type: Array,
      value: ['#ababab']
    },
    maxValue: {
      type: Number,
      value: 0,
      observer(newData) {
        this.data.yDomain = [this.data.minValue, newData]
      }
    },
    minValue: {
      type: Number,
      value: 0,
      observer(newData) {
        this.data.yDomain = [newData, this.data.maxValue]
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        this.data.xRange = [0, newData]
        let gap = (this.data.xRange[1] - this.data.xRange[0]) / (this.data.timeIndex - 1)
      
      this.data.gap = gap
        if(this.data.currentIndex >= 0 && this.data.showCrosshair) {
          this.moveCrosshair(this.data.currentIndex, true)
        }
        this.doDraw()
      }
    },
    drawData: {
      type: Object,
      value: {},
      observer(newData) {
        
        this.data.data = newData
        this.doDraw()
      }
    },
    key: {
      type: String,
      value: 'kline'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showCrosshair: false,
    crosshair: {
      x: 100,
      y: 0
    },
    gap: 1,
    yRange: [0, 200],
    xRange: [0, 300],
    yDomain: [],
  },
  lifetimes: {
    attached() {
      EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
      EventBus.on('closecrosshair', this.closeCrosshair.bind(this))
      this.doDraw()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    longTapMove:debounce(function(e, isDate = false) {
      let x 
      x = e.changedTouches[0].x
      
      EventBus.emit('movecrosshair', {x, type: this.data.key})
    }, 0),
    closeCrosshair() {
      this.data.showCrosshair = false
      this.draw()
    },
    moveCrosshair(crosshairPosition) {
      
      if(crosshairPosition.type !== this.data.key) {
        return 
      }
      
      this.setData({
        showCrosshair: true,
        crosshair: {x: crosshairPosition.x}
      })
      this.draw()
    },
    clearCanvas(){
      const ctx = wx.createCanvasContext('firstCanvas', this)
      ctx.draw()
    },
    doDraw() {
      if(this.data.data.length === 0) {
        this.clearCanvas()
      }
      
      if (this.data.data.length && Object.keys(this.data.data[0]).length !== 0 ) {
        
        wx.nextTick(() => {
          this.draw()
        })
        
      }
    },
    transfer2y(y) {
      let yRange = this.data.yRange
      let yDomain = this.data.yDomain
      return (yDomain[1] - y) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
    },
    draw() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      if (this.data.showCrosshair && this.data.data.length) {
        this.drawCrosshair(ctx)
      }
      if(this.data.data.length) {
        this.drawMidLine(ctx)
      }
      
      for(let i = 0, length = this.data.data.length; i < length; i++) {
        
        this.drawFline(ctx, this.data.data[i], this.data.colors[i % this.data.colors.length])
      }
      ctx.draw()
    },
    drawMidLine(ctx){
      let mid = (this.data.yRange[0] + this.data.yRange[1]) / 2
      ctx.beginPath()
      ctx.setLineDash([3, 3], 2)
      ctx.moveTo(0, mid)
        ctx.lineTo(this.data.xRange[1], mid)
      ctx.setStrokeStyle('gray')
      ctx.stroke()
      ctx.setLineDash([0, 0], 0)
      ctx.closePath()
    },
    drawFline(ctx, drawData, color){
      let data = drawData
      ctx.beginPath()
      ctx.moveTo(data[0].x, this.transfer2y(data[0].y))
      for (let i = 1, length = data.length; i < length; i++) {
        ctx.lineTo(data[i].x, this.transfer2y(data[i].y))
      }
      ctx.setStrokeStyle(color)
      ctx.stroke()
      ctx.closePath()
    },
    closeCrosshair() {  
      this.data.showCrosshair = false
      this.draw()
    },
    drawCrosshair(ctx) {
      ctx.moveTo(this.data.crosshair.x, 0)
      ctx.lineTo(this.data.crosshair.x, this.data.yRange[1])
      // ctx.moveTo(0, this.data.crosshair.y)
      // ctx.lineTo(this.data.xRange[1], this.data.crosshair.y)
      ctx.setStrokeStyle('black')
      ctx.stroke()
    },
  }
})
