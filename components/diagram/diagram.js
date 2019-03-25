import debounce from '../../utils/debounce.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'
import EventBus from '../../utils/pubsub.js'



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isStock: {
      type: Boolean,
      value: false,
      observer(newData) {

      }
    },
    height: {
      type: Number,
      value: 300,
      observer(newData) {
        this.data.yRange = [0, newData]
        this.doDraw()
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        this.data.xRange = [0, newData]
        let gap = (this.data.xRange[1] - this.data.xRange[0]) / (this.data.timeIndex - 1)

        this.data.gap = gap
        if (this.data.currentIndex >= 0 && this.data.showCrosshair) {
          this.moveCrosshair(this.data.currentIndex, true)
        }
        this.doDraw()
      }
    },
    drawData: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        if(newData.data.length === 0) {
          this.clearCanvas()
        }
        if (newData.data.length > 0 && !this.data.firstInit) {
          this.data.firstInit = true
          if (this.data.kSettingItem.fsHair) {
            this.data.showCrosshair = true
            let index = newData.data.length - 1
            if (!this.data.kSettingItem.jhjj) {
              index -= 15
            }
            this.moveCrosshair(index)
          }
        }
        this.data.data = newData
        this.doDraw()
      }
    },
    kSettingItem: {
      type: Object,
      value: {},
      observer(newData) {
        if (newData.jhjj == true) {
          this.openjhjj()
        } else {
          this.closejhjj()
        }
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
    data: {
      pcp: 0
    },
    currentIndex: -1,
    xRange: [0, 300],
    gap: 1,
    callAuctionCloseArr: [1030, 1130, 1400],
    callAuctionOpenArr: [930, 1030, 1130, 1400],
    yRange: [0, 200],
    xGrid: [1030, 1130, 1400],
    yDomain: [],
    firstInit: false,
    start: [9, 30],
    timeIndex: 241,
    currentTimeIndex: 0,
    chaPercent: 0,
  },
  //事件处理函数


  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      let kSettingItem = wx.getStorageSync('kSettingItem')
      if (kSettingItem) {
        this.setData({
          kSettingItem,
        })
      }


      this.doDraw()
    }
  },

  pageLifetimes: {
    show() {
    }
  },
  methods: {
    clearCanvas() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      ctx.draw()
    },
    doDraw() {
      if (Object.keys(this.data.data).length !== 0 && this.data.data.data.length) {
        this.preprocess()
      }
      this.draw()
    },
    closejhjj() {

      this.data.xGrid = this.data.callAuctionCloseArr
      this.data.start = [9, 30]
      this.data.timeIndex = 241
      this.data.openjhjjFlag = false
      this.data.currentTimeIndex = this.data.currentTimeIndex - 15

      this.doDraw()
    },
    moveLeft() {
      this.move('left')
    },
    getNextDataIndex(index, step) {
      let time = this.transferIndex2Time(index)
      let realIndex = index
      for (let i = 0; i < this.data.data.data.length; i++) {
        if (this.data.data.data[i].date === time) {
          realIndex = i
        }
      }
      realIndex += step
      if(realIndex < 0) {
        realIndex = 0
      } else if(realIndex >= this.data.data.data.length) {
        realIndex = this.data.data.data.length - 1
      }
      return this.transfer2TimeIndex(this.data.data.data[realIndex].date)
    },
    move(direction) {
      if(!this.data.showCrosshair) {
        return
      }
      let step = 0
      let index = this.data.currentIndex 
      if(direction == 'left') {
        step = -1
      } else {
        step = 1
      }
      index = this.getNextDataIndex(index, step)
      // if(step < 0 && index > 0) {
      //   index += step
      //   let time = this.transferIndex2Time(index)
      //   this.data.currentIndex = index
      //   this.moveCrosshair(index, true)
      // } else if(index < this.data.currentTimeIndex && step > 0){
      //   index += step
        // let time = this.transferIndex2Time(index)
        
        if(this.data.currentIndex == index) {
          if(direction == 'left') {
            EventBus.emit('diagramUnableLeft')
          } else {
            EventBus.emit('diagramUnableRight')
          }
          return
        }
        this.data.currentIndex = index
        this.moveCrosshair(index, true)
      // }

    },
    moveRight() {
      this.move('right')
    },
    openjhjj() {
      this.data.openjhjjFlag = true
      this.data.xGrid = this.data.callAuctionOpenArr
      this.data.start = [9, 15]
      this.data.timeIndex = 256
      this.data.currentTimeIndex = this.data.currentTimeIndex + 15

      this.doDraw()
    },
    draw() {

      const ctx = wx.createCanvasContext('firstCanvas', this)
      if (this.data.showCrosshair) {
        this.drawCrosshair(ctx)
      }

      if (Object.keys(this.data.data).length !== 0 && this.data.data.data.length) {
        if (this.data.kSettingItem.fsjx) {
          this.drawAPL(ctx)
        }
        ctx.beginPath()
        ctx.closePath()
        this.drawFline(ctx)
        this.drawText(ctx)
      }
      // this.drawContainerRect(ctx)
      // 
      // if(this.data.data.length > 0) {
        
      // }
      this.drawGrid(ctx)

      ctx.draw()
    },
    closeCrosshair() {
      EventBus.emit('closeDiagram')
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
    tranferX2Index(x) {
      let index = Math.round(x / this.data.gap)
      if (index > this.data.currentTimeIndex) {
        index = this.data.currentTimeIndex
      } else if (index < 0) {
        index = 0
      }
      return index
    },
    setCrosshair(index) {

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
      tempDate.price = getNumUnit(tempDate.price)
      tempData.dealA = getNumUnit(tempData.dealA)
      tempData.dealN = getNumUnit(tempData.dealN)
      tempData.averageDa = tempData.averageDa

      let y = this.transfer2y(price)
      let xLength = index * this.data.gap
      if (typeof e !== 'number') {
        this.triggerEvent('drawcrosshair', {
          x: xLength,
          currentInfo: tempData
        })
      }

      if (!this.data.showCrosshair) {
        this.triggerEvent('showcurrentInfo', {
          currentInfo: tempData
        })
      }
      this.data.showCrosshair = true
      this.data.crosshair = {
        x: xLength,
        y
      }
    },
    moveCrosshair: debounce(function(e, isDate = false) {
      EventBus.emit('resetDiagram')
      let x 
      if(typeof e === 'number') {
        x = e
      } else {
        x = e.changedTouches[0].x
      }

      let index
      if (!isDate) {
        index = this.tranferX2Index(x)
      } else {
        index = e
      }
      this.data.currentIndex = index
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
      tempData.rise = (parseFloat(tempData.dealPrice) - parseFloat(this.data.data.pcp)) / parseFloat(this.data.data.pcp) * 100
      tempData.rise = (tempData.rise).toFixed(2)
      let y = this.transfer2y(price)

      let xLength = index * this.data.gap
      if (typeof e !== 'number' || !this.firstInit) {
        this.triggerEvent('drawcrosshair', {
          x: xLength
        })
      }

      if (!this.data.showCrosshair) {
        this.triggerEvent('showcurrentInfo')
      }
      EventBus.emit('changecurrentInfo', tempData)
      this.data.showCrosshair = true
      this.data.crosshair = {
        x: xLength,
        y
      }
      this.draw()
    }, 0),
    preprocess() {

      let data = this.data.data
      let zuidacha = (data.pcp * 0.02).toFixed(2)
      let lastDate = data.data[data.data.length - 1].date
      let currentTimeIndex = this.transfer2TimeIndex(lastDate)

      this.data.currentTimeIndex = currentTimeIndex
      let zuidacha1 = Math.abs(data.pcp - data.hp).toFixed(2)
      let zuidacha2 = Math.abs(data.pcp - data.lp).toFixed(2)
      if (parseFloat(zuidacha1) >= parseFloat(zuidacha2)) {
        zuidacha = parseFloat(zuidacha1) > parseFloat(zuidacha) ? parseFloat(zuidacha1) : parseFloat(zuidacha)
      } else {
        zuidacha = parseFloat(zuidacha2) > parseFloat(zuidacha) ? parseFloat(zuidacha2) : parseFloat(zuidacha)
      }
      let zhi = parseFloat(zuidacha) + parseFloat(data.pcp)
      let chaPercent = (parseFloat(zuidacha) / parseFloat(data.pcp) * 100).toFixed(2)

      let yDomain = [parseFloat((data.pcp - zuidacha).toFixed(2)), parseFloat(zhi.toFixed(2))]
      this.data.yDomain = yDomain
      this.data.chaPercent = parseFloat(chaPercent)
      for (let i = 0, length = data.data.length; i < length; i++) {
        data.data[i].x = this.transfer2x(data.data[i].date)
        data.data[i].y = this.transfer2y(data.data[i].dealPrice)
        data.data[i].averagey = this.transfer2y(data.data[i].averagePrice)
      }
      this.data.data = data
    },

    drawContainerRect(ctx) {

      ctx.setStrokeStyle('black')
      ctx.strokeRect(0, 0, this.data.xRange[1], this.data.yRange[1])

    },
    drawTimeLine(time, ctx) {
      let x = this.transfer2x(time)
      // ctx.setStrokeStyle('black')
      ctx.beginPath()
      ctx.setLineDash([3, 3], 2)
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.data.yRange[1])
      ctx.closePath()
      ctx.stroke()
    },
    drawGrid(ctx) {
      let timeArr = this.data.xGrid
      ctx.setStrokeStyle('rgba(186, 186, 186, 1)')
      for (let i = 0, length = timeArr.length; i < length; i++) {
        this.drawTimeLine(timeArr[i], ctx)
      }
      const midY = this.data.yRange[1] / 2
      const firstY = (this.data.yRange[0] + midY) / 2
      const lastY = (this.data.yRange[1] + midY) / 2
      // ctx.beginPath()
      ctx.beginPath()
      ctx.setLineDash([3, 3], 2)
      ctx.moveTo(0, midY)
      ctx.lineTo(this.data.xRange[1], midY)
      ctx.moveTo(0, firstY)
      ctx.lineTo(this.data.xRange[1], firstY)
      ctx.moveTo(0, lastY)
      ctx.lineTo(this.data.xRange[1], lastY)
      ctx.closePath()
      ctx.stroke()
      ctx.setLineDash([0, 0], 0)
    },
    preDraw() {
      const ctx = wx.createCanvasContext('firstCanvas', this)
      this.drawGrid(ctx)
      ctx.draw()
    },
    drawText(ctx) {
      
      const midY = this.data.yRange[1] / 2
      const fontSize = 10
      const yEnd = this.data.yRange[1]
      const xEnd = this.data.xRange[1] - 3 * fontSize
      ctx.setFontSize(fontSize)
      
      let TextInfo

      if(this.data.isStock) {
        TextInfo = [{
          text:this.data.data.pcp,
          x: xEnd,
          y: midY + fontSize/3,
          color: 'gray'
        }, {
          text:this.data.yDomain[1],
          x: xEnd,
          y:fontSize,
          color: 'gray'
        }, {
          text:this.data.yDomain[0],
          x: xEnd,
          y: yEnd - fontSize/3,
          color: 'gray'
        }]
      } else {
        TextInfo = [{
          text: Math.round(this.data.data.pcp),
          x: xEnd,
          y: midY + fontSize/3,
          color: 'gray'
        }, {
          text: Math.round(this.data.yDomain[1]),
          x: xEnd,
          y:fontSize,
          color: 'gray'
        }, {
          text: Math.round(this.data.yDomain[0]),
          x: xEnd,
          y: yEnd - fontSize/3,
          color: 'gray'
        }]
      }
      for(let i = 0; i < TextInfo.length; i++) {
        ctx.setFillStyle(TextInfo[i].color)
        ctx.fillText(TextInfo[i].text, TextInfo[i].x, TextInfo[i].y)
      }
    },
    drawAPL(ctx) {
      let data = this.data.data.data
      let i = 0
      while (parseInt(data[i].date) < 930) {
        i++
      }
      ctx.beginPath()
      ctx.moveTo(data[i].x, data[i].averagey)

      for (let length = data.length; i < length; i++) {
        ctx.lineTo(data[i].x, data[i].averagey)

      }

      ctx.setStrokeStyle('orange')
      ctx.stroke()
      ctx.closePath()
    },
    drawFline(ctx) {
      let data = this.data.data.data

      ctx.moveTo(data[0].x, data[0].y)
      for (let i = 1, length = data.length; i < length; i++) {
        ctx.lineTo(data[i].x, data[i].y)
      }

      ctx.setStrokeStyle('blue')
      ctx.setLineDash([0, 0], 0)
      ctx.stroke()
      ctx.closePath()


    },
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
    transfer2y(y) {
      let yRange = this.data.yRange
      let yDomain = this.data.yDomain
      return (yDomain[1] - y) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
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
    transfer2x(time) {
      let index = this.transfer2TimeIndex(time)
      let gap = this.data.gap

      return gap * index
    }
  }
})