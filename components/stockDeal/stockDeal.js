
import debounce from '../../utils/debounce.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'

const FONT_SIZE = 10
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
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        this.data.xRange = [0, newData]
        if (Object.keys(this.data.data).length !== 0) {
          this.preprocess()

        }
        this.draw()
      }
    },
    drawData: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        
        this.data.data = newData
        
        if (Object.keys(this.data.data).length !== 0) {
          this.preprocess()

        }
        this.draw()
      }
    },
    kSettingItem: {
      type: Object,
      value: {},
      observer(newData) {
        
        this.draw()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideCrossHairHandle: null,
    showCrosshair: false,
    crosshair: {
      x: 100,
      y: 0
    },
    data: {},
    xRange: [0, 300],
    gap: 1,
    yRange: [0, 200],
    yDomain: [],
    chaPercent: 0,
    start: [9, 30],
    timeIndex: 241,
    showCrosshair: false
  },
  //事件处理函数


  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      if (Object.keys(this.data.data).length !== 0) {
        this.preprocess()
      }
    },
  },
  pageLifetimes: {
    onShow() {
      this.draw()
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化


    }
  },
  methods: {
    transferIndex2Time(index) {
      if (this.data.openjhjjFlag) {
        index = index + 15
      } else {
        index = index + 30
      }
      if (index > 150) {
        index += 90
      }
      let hours = Math.floor(index / 60) + 9

      let min = index % 60
      return String(100 + hours).slice(1) + String(100 + min).slice(1)
    },
    moveCrosshair: debounce(function(e) {

      let x = e.changedTouches[0].x
      let index = this.tranferX2Index(x)
      let time = this.transferIndex2Time(index)

      let price
      let tempData
      for (let i = 0; i < this.data.data.data.length; i++) {
        if (this.data.data.data[i].date === time) {
          price = this.data.data.data[i].dealPrice
          tempData = Object.assign({}, this.data.data.data[i])
        }
      }
      tempData.date = tempData.date.replace(/(\d{2})(\d{2})/, "$1:$2")

      tempData.dealA = getNumUnit(tempData.dealA)
      tempData.dealN = getNumUnit(tempData.dealN)
      tempData.averageDa = tempData.averageDa

      let y = this.transfer2y(price)
      let xLength = index * this.data.gap
      
      this.triggerEvent('drawcrosshair', {
        x: xLength,
        currentInfo: tempData,
        
      })
      this.data.showCrosshair = true
      this.data.crosshair = {
        x: xLength,
          y
      }
      this.data.crossX = xLength
      this.draw()
    }, 0),
    tranferX2Index(x) {
      let index = Math.round(x / this.data.gap)
      if (index > this.data.currentTimeIndex) {
        index = this.data.currentTimeIndex
      } else if (index < 0) {
        index = 0
      }
      return index
    },
    transfer2TimeIndex(time) {
      let start = this.data.start
      let date = []

      let dataDate = parseInt(time)
      date[0] = Math.floor(dataDate / 100)

      date[1] = dataDate % 100

      let index = (date[0] - start[0]) * 60 + (date[1] - start[1])
      if (date[0] >= 13) {
        index = index - 90
      }
      return index
    },
    drawAverageLine(ctx) {
      ctx.beginPath()  
      
      let data = this.data.data.data

      let i = 0,
        length = data.length;
      for (length = data.length; i < length; i++) {
        if (parseInt(data[i].date) === 930) {
          break;
        }
      }
      ctx.moveTo(data[i].x + this.data.gap, data[i].averagey)
      i++
      for (length = data.length; i < length; i++) {
        ctx.lineTo(data[i].x + this.data.gap, data[i].averagey)

      }
      ctx.stroke()
      ctx.setStrokeStyle('blue')
      ctx.closePath()
    },
    drawCrossHair(x) {
      this.data.showCrosshair = true
      this.data.crossX = x
      this.draw()
    },
    closejhjj() {
      this.data.start = [9, 30]
      this.data.timeIndex = 241
      if (Object.keys(this.data.data).length !== 0) {
        this.preprocess()
      }
      this.draw()
    },
    openjhjj() {
      this.data.start = [9, 15]
      this.timeIndex = 256
      if (Object.keys(this.data.data).length !== 0) {
        this.preprocess()
      }
      this.draw()
    },
    closeCrosshair() {
      this.data.showCrosshair = false
      this.draw()
    },
    draw() {
      const ctx = wx.createCanvasContext('secondCanvas', this)
   
      if (Object.keys(this.data.data).length !== 0 && this.data.data.data.length) {
        this.drawFline(ctx)
        if(this.data.kSettingItem.fsjlx) {
        this.drawAverageLine(ctx)
        }
        // this.drawContainerRect(ctx)
        // this.drawText(ctx)
      }
      if (this.data.showCrosshair) {
        ctx.beginPath()
        ctx.setStrokeStyle('gray')
        ctx.moveTo(this.data.crossX, this.data.yRange[0])
        ctx.lineTo(this.data.crossX, this.data.yRange[1])
        ctx.stroke()
        ctx.closePath()
      }
      ctx.beginPath()
        ctx.setStrokeStyle('gray')
        ctx.stroke()
        ctx.closePath()
      this.drawGrid(ctx)
      ctx.draw()
    },
    preprocess() {
      
      let reactWidth = (this.data.xRange[1] - this.data.xRange[0]) / (this.data.timeIndex - 1)
      let gap = reactWidth
      this.data.gap = reactWidth
      
      let data = this.data.data


      let yDomain = [0, data.maxDeal]
      this.data.yDomain = yDomain
      this.data.beforePrice = data.pcp
      let start = this.data.start

      for (let i = 0, length = data.data.length; i < length; i++) {
        let date = []
        let dataDate = parseInt(data.data[i].date)
        date[0] = Math.floor(dataDate / 100)

        date[1] = dataDate % 100

        let index = (date[0] - start[0]) * 60 + (date[1] - start[1])
        if (date[0] >= 13) {
          index = index - 90
        }
        data.data[i].x = gap * index
        data.data[i].y = this.transfer2y(data.data[i].dealA)
        data.data[i].averagey = this.transfer2y(data.data[i].averageDa)
      }
      wx.setStorageSync('fsdealnumshowparams', {
        maxDeal:data.maxDeal,
        showjlx: this.data.kSettingItem.fsjlx,
        showjhjj: this.data.kSettingItem.jhjj
      })
      this.data.data = data
    },
    drawContainerRect(ctx) {

      ctx.setStrokeStyle('black')
      ctx.strokeRect(0, 0, this.data.xRange[1], this.data.yRange[1])

    },
    drawGrid(ctx) {
      ctx.setStrokeStyle('rgba(186, 186, 186, 0.6)')
      const yLineNum = 3
      let spd = this.data.yRange[1] / yLineNum
      for (let i = 1; i <= yLineNum; i++) {
        ctx.moveTo(0, spd * i)
        ctx.lineTo(this.data.xRange[1], spd * i)
      }
      ctx.stroke()
    },
    drawText(ctx) {
      const midY = this.data.yRange[1] / 2
      const fontSize = 12
      const yEnd = this.data.yRange[1]
      const xEnd = this.data.xRange[1]
      ctx.setFontSize(fontSize)
      ctx.fillText(this.data.data.pcp, 0, midY)
      ctx.setFillStyle('red')
      ctx.fillText(this.data.yDomain[1], 0, fontSize)
      ctx.fillText(this.data.chaPercent + '%', xEnd - 3 * fontSize, fontSize)
      ctx.setFillStyle('Green')
      ctx.fillText(this.data.yDomain[0], 0, yEnd)
      ctx.fillText(this.data.chaPercent + '%', xEnd - 3 * fontSize, yEnd)
      ctx.setFontSize(FONT_SIZE)
      ctx.setFillStyle('black')
      ctx.fillText('9:30', 0, yEnd + FONT_SIZE)
      ctx.fillText('15:00', xEnd - 3 * FONT_SIZE, yEnd + FONT_SIZE)
    },
    drawFline(ctx) {
      let data = this.data.data.data
      let beforePrice = this.data.beforePrice
      // CanvasContext.setLineWidth(this.xRange[1]/this.data.tim)
      // ctx.stroke()
      for (let i = 0, length = data.length; i < length; i++) {
        // ctx.moveTo(data[i].x, this.data.yRange[1])
        // ctx.lineTo(data[i].x, data[i].y)
        // ctx.setStrokeStyle('black')
        // ctx.strokeRect(data[i].x, data[i].y, this.data.gap, this.data.yRange[1] - data[i].y)
        // ctx.setStrokeStyle('black')
        ctx.beginPath()
        if (data[i].dealPrice <= beforePrice) {
          ctx.setStrokeStyle('green')
        } else {
          ctx.setStrokeStyle('red')
        }
        
        ctx.moveTo(data[i].x, this.data.yRange[1])
        ctx.lineTo(data[i].x, data[i].y)
        // ctx.fillRect(data[i].x, data[i].y, 0.5, this.data.yRange[1] - data[i].y)
        ctx.stroke()
        ctx.closePath()
        beforePrice = data[i].dealPrice
      }
      // ctx.setStrokeStyle('orange')
      // ctx.stroke()


    },
    transfer2y(y) {
      let yRange = this.data.yRange
      let yDomain = this.data.yDomain
      return (yDomain[1] - y) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
    },

    transfer2x() {

    },
    convertDataToPositonArr() {
      let data = this.data.data
      let posArr = []
      let temp
      for (let i = 0; i < data.length; i++) {
        temp = {}
        temp.x = this.converDateToX(data[i].date)
        temp.y = this.converPriceToY(data[i].price)
        posArr.push(temp)
      }
      this.data.posArr = posArr
    }
  }
})