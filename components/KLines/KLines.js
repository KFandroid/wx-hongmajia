// components/KLines/KLines.js
import debounce from '../../utils/debounce.js'
import EventBus from '../../utils/pubsub.js'

import {
  throttle
} from '../../utils/util.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'

const app = getApp()
const dealKDJ = function (data) {
  for (let i = 0, length = data.length; i < length; i++) {
    let rangeData = []
    if (i < 8) {
      i.yValue = '-'
    } else {
      rangeData = data.slice(i - 8, i + 1)
    }
  }
}


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
        if (this.data.context) {
          this.drawSplitLine()
          this.data.context.draw()
        }
        if (newData > 0 && this.data.data.rf && this.data.data.rf.length > 0 && this.data.width && this.data.height) {
          this.processData()
          this.draw()
        }
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        if (newData > 0 && this.data.data.rf && this.data.data.rf.length > 0 && this.data.width && this.data.height) {
          this.processData()
          this.draw()
        }
      }
    },
    kLinesData: {
      type: Object,
      value: {},
      observer(newData, oldData) {
        if (newData && newData.data) {
          if (oldData.data && oldData.page !== newData.page && this.data.firstInit) {
            this.data.start += newData.data.length
            this.data.end += newData.data.length
            newData.data = newData.data.concat(oldData.data)
          }
          this.data.firstInit = true


          if (oldData.page !== newData.page) {
            
            this.data.data = {
              rf: newData.data
            }
            this.data.count = 0
            this.data.newCount = 0
            // if (oldData.data && oldData.page !== newData.page) {
            if (newData.data && this.data.width && this.data.height) {
              this.processData()
              this.draw()
            }
          }

          // }
        }
      }
    },
    kLinesDataCurrent: {
      type: Object,
      value: {},
      observer(newData) {
        let oldCount
        if (newData && this.data.data.rf && newData.data) {
          oldCount = this.data.data.rf.length
          if (this.data.selectIndex > 2 && this.data.selectIndex != 5) { //5 是周K
            for (let i = 0; i < newData.data.length; i++) {
              let flag = true
              for (let j = 0; j < this.data.data.rf.length; j++) {

                if (this.data.data.rf[j].date == newData.data[i].date) {
                  this.data.data.rf[j] = newData.data[i]
                  // this.data.data.rf[j].date = newData.data[i].date + ' ' + newData.data[i].time
                  flag = false
                }

              }
              if (flag) {
                this.data.data.rf.push(newData.data[i])
                // this.data.start += 1
                //  this.data.end += 1
                this.data.data.rf[this.data.data.rf.length - 1].date = this.data.data.rf[this.data.data.rf.length - 1].date
                this.data.count = 0
                this.data.newCount = 0
              }
            }
          } else {
            for (let i = 0; i < newData.data.length; i++) {
              let flag = true
              for (let j = 0; j < this.data.data.rf.length; j++) {
                if (this.data.data.rf[j].date == newData.data[i].date) {
                  this.data.data.rf[j].date = newData.data[i].date
                  flag = false
                }
              }
              if (flag) {
                this.data.data.rf.push(newData.data[i])
                this.data.count = 0
                this.data.newCount = 0
              }
            }
          }
          let nowCount = this.data.data.rf.length
          let dvalue = nowCount - oldCount
          if (dvalue > 0) {
            this.data.start = this.data.start + dvalue
            this.data.end = this.data.end + dvalue
          }
          if (!this.data.clickBtn || this.data.end == this.data.data.rf.length) {
            this.data.start = -1
            this.data.end = -1
          }
          if (Object.keys(this.data.data.rf).length !== 0 && this.data.width && this.data.height) {
            this.processData()
            this.draw()
          }
        }
      }
    },
    selectIndex: {
      type: Number,
      value: null
    },
    rfArr: {
      type: Object,
      value: {}
    },
    kSettingItem: {
      type: Object,
      value: {},
      observer(newData) {
        if (newData.beforeRf) {
          this.beforeRf()
        } else {
          this.cancelRf()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lineWidth: 1,
    moveDirection: null,
    stepMove: 0,
    xDomain: [],
    yRange: [],
    yDomain: [],
    data: {},
    firstInit: false,
    prevEndDate: null,
    currentIndex: 0,
    prevStartDate: null,
    context: null,
    rectInterval: 1,
    rectWidth: 5,
    oldCount: 0,
    count: 0,
    needData: {},
    crosshairDate: null,
    showCrosshair: false,
    crosshair: {
      x: 0,
      y: 0
    },
    beforeRf: true,
    sizeLevel: 2,
    sizeType: [{
      width: 1,
      interval: 1
    }, {
      width: 3,
      interval: 1
    }, {
      width: 5,
      interval: 1
    }, {
      width: 9,
      interval: 1
    }, {
      width: 15,
      interval: 2
    }, {
      width: 23,
      interval: 2
    }, {
      width: 35,
      interval: 3
    }, {
      width: 55,
      interval: 3
    }],
    start: -1,
    end: -1,
    clickBtn: false,
    lineArr: {}
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {
      this.data.context = wx.createCanvasContext('myCanvas', this)
      EventBus.on('movecrosshair', this.moveCrosshair.bind(this))
      EventBus.on('closecrosshair', this.closeCrosshair.bind(this))
      EventBus.on('clearcanvas', this.clearCanvas.bind(this))
    },
    detached() {
    }
  },
  methods: {
    clearCanvas() {

      let ctx = wx.createCanvasContext('myCanvas', this)
      this.drawSplitLine()
      ctx.draw()
    },
    initSetting() {
      this.data.start = -1
      this.data.end = -1
      this.data.moveDirection = null
      this.data.firstInit = false
      this.data.oldCount = 0
      this.data.count = 0
      this.data.data = {}
    },
    longTapMove: debounce(function (e, isDate = false) {
      let x

      x = e.changedTouches[0].x
      this.data.rectWidth = this.data.sizeType[this.data.sizeLevel].width
      this.data.rectInterval = this.data.sizeType[this.data.sizeLevel].interval

      let width = this.data.rectInterval + this.data.rectWidth
      let index = Math.floor(x / width)
      if (index < 0) {
        index = 0
      }
      if (index >= this.data.needData.length) {
        index = this.data.needData.length - 1
      }
      this.data.currentIndex = index
      let realX = index * width + this.data.rectWidth / 2
      let type
      switch (this.data.selectIndex) {
        case 2:
          type = 'kline'
          break
        case 3:
          type = 'k5line'
          break
        case 4:
          type = 'k30line'
          break
        case 5:
          type = 'kweekline'
          break
      }
      EventBus.emit('movecrosshair', {
        x: realX,
        type,
      })
    }, 0),
    addZero(code, zeroNum) {
      code = String(code).split('')
      let leftZero = zeroNum - code.length
      for (let i = 0; i < leftZero; i++) {
        code.unshift('0')
      }
      return code.join('')
    },
    closeCrosshair() {
      this.data.showCrosshair = false
      if (Object.keys(this.data.data).length !== 0 && Object.keys(this.data.data.rf).length !== 0) {
        this.draw()
      }
    },
    calculateCrosshair(crosshairPosition) {
      let type
      switch (this.data.selectIndex) {
        case 2:
          type = 'kline'
          break
        case 3:
          type = 'k5line'
          break
        case 4:
          type = 'k30line'
          break
        case 5:
          type = 'kweekline'
          break
      }
      if (crosshairPosition.type !== type) {
        return
      }
      let x = crosshairPosition.x
      this.data.rectWidth = this.data.sizeType[this.data.sizeLevel].width
      this.data.rectInterval = this.data.sizeType[this.data.sizeLevel].interval
      let index = Math.floor(x / (this.data.rectWidth + this.data.rectInterval))
      if (index < 0) {
        index = 0
      }
      if (index >= this.data.needData.length) {
        index = this.data.needData.length - 1
      }
      this.data.currentIndex = index
      if (Object.prototype.toString.call(this.data.needData) !== "[object Array]") {
        return
      }

      let selectData = this.data.needData[index]

      // if (isDrawLast) {
      //   selectData = this.data.needData[this.data.needData.length - 1]
      // }
      let price
      price = selectData.price
      let date = selectData.date
      this.data.crosshairDate = date
      let y = this.computeY(price)
      let crosshair = {
        y,
        x: this.data.xDomain[index]
      }

      let tempData = Object.assign({}, this.data.needData[index])
      tempData.showValue = getNumUnit(tempData.value)
      tempData.showVolume = getNumUnit(tempData.volume)
      tempData.rise = (parseFloat(tempData.price) - parseFloat(tempData.open)) / parseFloat(tempData.open) * 100
      tempData.rise = (tempData.rise).toFixed(2)
      if (!this.data.showCrosshair) {
        this.triggerEvent('showcurrentInfo')
      }
      this.data.showCrosshair = true
      this.data.crosshair = crosshair
      EventBus.emit('changekInfo', tempData)
    },
    moveCrosshair(crosshairPosition) {
      this.calculateCrosshair(crosshairPosition)
      this.processData()
      this.draw()
    },
    processData() {
      this.data.rectWidth = this.data.sizeType[this.data.sizeLevel].width
      this.data.rectInterval = this.data.sizeType[this.data.sizeLevel].interval
      if (this.data.beforeRf) {
        this.processRf()
      }
      this.data.context.lineWidth = this.data.lineWidth;
      this.data.context.fillStyle = "#000";
      if (this.data.count > 0) {
        this.data.oldCount = this.data.count
      }

      let count = this.data.count = Math.floor(this.data.width / (this.data.rectWidth + this.data.rectInterval))
      if (this.data.oldCount == 0) {
        this.data.oldCount = count
      }
      if (this.data.start == -1 && count > 0) {
        this.data.start = this.data.data.rf.length - count
      }
      if (this.data.end == -1 && count > 0) {
        this.data.end = this.data.data.rf.length
      }
      let newCount = 0
      let left, right

      newCount = this.data.count - this.data.oldCount
      left = Math.ceil(newCount / 2)
      right = Math.floor(newCount / 2)
      if (this.data.end + right > this.data.data.rf.length) {
        this.data.end = this.data.data.rf.length
        left += this.data.end + right - this.data.data.rf.length
        right -= this.data.end + right - this.data.data.rf.length
      }
      if (this.data.start - left < 0) {

        if (this.data.kLinesData.page !== '001') {
          EventBus.emit('changestocktarget')
          this.triggerEvent("getPrevData", this.addZero(this.data.kLinesData.page - 1, 3))
          return;
        }

      }
      if (!this.data.showCrosshair) {
        this.data.start -= left + right
      } else {
        this.data.start -= left
        this.data.end += right
      }
      let moveDirection = this.data.moveDirection
      if (moveDirection) {
        const movePercent = 0.5
        let moveCount = Math.round(count * movePercent)
        if (this.data.stepMove != 0) {
          moveCount = this.data.stepMove
          wx.nextTick(() => {
            this.moveCrosshairByBtn(moveDirection)
          })
          this.data.stepMove = 0

        }
        if (moveDirection === 'left') {
          if (this.data.start - moveCount < 0) {
            if (this.data.kLinesData.page !== '001') {
              EventBus.emit('changestocktarget')
              this.triggerEvent("getPrevData", this.addZero(this.data.kLinesData.page - 1, 3))
              return;
            }
          }
          this.data.start -= moveCount
          this.data.end -= moveCount
          if (this.data.start < 0) {
            this.data.end -= this.data.start
            this.data.start = 0
          }

        } else if (moveDirection === 'right' && this.data.end < this.data.data.rf.length - 1) {
          this.data.start += moveCount
          this.data.end += moveCount
          if (this.data.end > this.data.data.rf.length) {

            this.data.end = this.data.data.rf.length
            this.data.start = this.data.end - this.data.count
          }

        }
        this.data.moveDirection = ''
      }
      let realIndex
      if (this.data.showCrosshair) {
        for (let i = 0, length = this.data.data.rf.length; i < length; i++) {
          if (this.data.data.rf[i].date === this.data.crosshairDate) {
            realIndex = i
          }
        }
        let start = this.data.start
        let end = this.data.end
        if (realIndex >= start && realIndex <= end) {

        } else if (realIndex < start) {
          let count = start - realIndex
          start = realIndex
          end -= count
        } else if (realIndex > end) {
          let count = realIndex - end
          end = realIndex
          start += count
        }
        if (realIndex === end) {
          start += 1
          end += 1
        }
        // if (realIndex === start) {
        //   end -= 1
        //   start -= 1
        // }
        this.data.start = start
        this.data.end = end
      }
      if (this.data.start < 0) {
        this.data.end -= this.data.start
        this.data.start = 0
      }
      if (this.data.end > this.data.data.rf.length) {
        if (this.data.start !== 0) {
          this.data.start += this.data.end - this.data.data.rf.length
        }
        this.data.end = this.data.data.rf.length
      }
      if (this.data.end - this.data.start !== count && this.data.end == this.data.data.rf.length) {
        if (this.data.start !== 0) {
          this.data.start += this.data.end - this.data.start - count
        }
      }


      if (this.data.beforeRf) {
        this.data.needData = this.data.data.beforeRf.slice(this.data.start, this.data.end)
      } else {
        this.data.needData = this.data.data.rf.slice(this.data.start, this.data.end)
      }
      this.data.realCount = this.data.needData.length
      EventBus.emit('changeRFData', [].concat(this.data.needData))
      let tempData = this.data.needData[this.data.needData.length - 1]
      let endDate = this.data.needData[this.data.needData.length - 1].date
      if (!this.data.showCrosshair) {
        tempData.showValue = getNumUnit(tempData.value)
        tempData.showVolume = getNumUnit(tempData.volume)
        tempData.rise = (parseFloat(tempData.price) - parseFloat(tempData.open)) / parseFloat(tempData.open) * 100
        tempData.rise = (tempData.rise).toFixed(2)
        EventBus.emit('changekInfo', tempData)
      }
      let startDate = this.data.needData[0].date
      let dateArr = this.data.needData.map(element => element.date)

      if ((this.data.prevEndDate !== endDate || this.data.prevStartDate !== startDate) && this.data.selectIndex === 2) {
        this.data.prevEndDate = endDate
        this.data.prevStartDate = startDate
        app.globalData.kDate = {
          start: startDate,
          end: endDate
        }
        app.globalData.kDateArr = dateArr
        EventBus.emit('changekdate', {
          start: startDate,
          end: endDate,
          dateArr: dateArr
        })
      }

      if (this.data.needData.length > 0) {
        let max = +this.data.needData[0].high,
          min = +this.data.needData[0].low
        for (let i = 0; i < this.data.needData.length; i++) {
          this.data.xDomain[i] = (this.data.rectWidth + this.data.rectInterval) * i + (this.data.rectWidth / 2)
          if (+this.data.needData[i].high > max) max = +this.data.needData[i].high
          if (+this.data.needData[i].low < min) min = +this.data.needData[i].low
        }
        this.data.yDomain = [min, max]
      }
      this.triggerEvent('changevollength', {
        end: this.data.end,
        rectWidth: this.data.rectWidth,
        rectInterval: this.data.rectInterval,
        start: this.data.start
      })
      // if (this.data.showCrosshair) {
      //   let start = this.data.start
      //   let currentIndex = realIndex - start
      //   if (realIndex === this.data.end) {
      //     currentIndex -= 1
      //   }
      //   if (isNaN(currentIndex)) {
      //     currentIndex = this.data.needData.length - 1
      //   }
      //   let price = this.data.needData[currentIndex].price
      //   let type
      //   switch (this.data.selectIndex) {
      //     case 2:
      //       type = 'kline'
      //       break
      //     case 3:
      //       type = 'k5line'
      //       break
      //     case 4:
      //       type = 'k30line'
      //       break
      //     case 5:
      //       type = 'kweekline'
      //       break
      //   }
      //   // this.calculateCrosshair({ x: this.data.xDomain[currentIndex], type })
      //   this.data.currentIndex = currentIndex
      //   EventBus.emit('movecrosshair', { x: this.data.xDomain[currentIndex], type })
      //   // this.triggerEvent('drawkcrosshair', {
      //   //   x: this.data.xDomain[currentIndex]
      //   // })
      // }
    },
    processRf() {
      let temp = this.data.data.beforeRf = JSON.parse(JSON.stringify(this.data.data.rf))
      let rfArr = this.data.rfArr
      for (let i = temp.length - 1; i >= 0; i--) {
        for (let j = 0; j < rfArr.length; j++) {
          if (+new Date(rfArr[j].date) > +new Date(temp[i].date)) {
            temp[i].high = (temp[i].high * rfArr[j].rf).toFixed(2)
            temp[i].low = (temp[i].low * rfArr[j].rf).toFixed(2)
            temp[i].price = (temp[i].price * rfArr[j].rf).toFixed(2)
            temp[i].open = (temp[i].open * rfArr[j].rf).toFixed(2)
            temp[i].volume = (temp[i].volume / rfArr[j].rf).toFixed(2)
          }
        }
      }
    },
    draw() {
      this.drawSplitLine()
      if (this.data.beforeRf) {
      this.calculateAvg()
      }
      if (this.data.showCrosshair) {
        this.drawCrosshair(this.data.context)
      }
      for (let i = 0; i < this.data.needData.length; i++) {
        let temp = this.data.needData[i]
        let high = this.computeY(this.data.needData[i].high)
        let low = this.computeY(this.data.needData[i].low)
        let y1, y2
        let color = '#000'
        if (this.data.needData[i].price > this.data.needData[i].open) {
          color = 'red'
          y1 = this.computeY(this.data.needData[i].price)
          y2 = this.computeY(this.data.needData[i].open)
        } else {
          color = 'green'
          y1 = this.computeY(this.data.needData[i].open)
          y2 = this.computeY(this.data.needData[i].price)
        }
        if (this.data.needData[i].price === this.data.needData[i].open) {
          y1 = this.computeY(this.data.needData[i].open)
          y2 = this.computeY(this.data.needData[i].price) + 1
        }
        this.drawSingle(this.data.xDomain[i], high, y1, y2, low, color)
      }

      this.data.context.draw()
    },
    calculateAvg() {
      if (this.data.kSettingItem) {
        if (this.data.kSettingItem.ydjx.show == true) {
          for (let i = 0; i < this.data.kSettingItem.ydjx.period.length; i++) {
            this.drawMoveAvg(this.data.kSettingItem.ydjx.period[i])
          }
        }
        if (this.data.kSettingItem.cbjx.show == true) {
          for (let i = 0; i < this.data.kSettingItem.cbjx.period.length; i++) {
            this.drawMoveAvg(this.data.kSettingItem.cbjx.period[i])
          }
        }

        let color = ['#4D4D4D', '#E3BC05', '#7927A9', '#00B050', '#E3BC05']
        let color2 = ['#000000', '#0070C0', '#8EB428', '#DA0253', '#2D755B']
        if (this.data.kSettingItem.ydjx.show == true) {
          for (let i = 0; i < this.data.kSettingItem.ydjx.period.length; i++) {
            this.drawBrokeLine(this.data.lineArr[this.data.kSettingItem.ydjx.period[i]], color[i])
          }
        }
        if (this.data.kSettingItem.cbjx.show == true) {
          for (let i = 0; i < this.data.kSettingItem.cbjx.period.length; i++) {
            this.drawBrokeLine(this.data.lineArr[this.data.kSettingItem.cbjx.period[i]], color2[i])
          }
        }
      }
    },
    drawCrosshair(ctx) {

      this.data.context.beginPath()
      ctx.moveTo(this.data.crosshair.x, 0)
      ctx.lineTo(this.data.crosshair.x, this.data.yRange[1])
      // ctx.moveTo(0, this.data.crosshair.y)
      // ctx.lineTo(this.properties.width, this.data.crosshair.y)
      ctx.setStrokeStyle('black')
      ctx.stroke()
      this.data.context.closePath()
    },
    drawSplitLine() {
      let temp = this.data.height / 4
      for (let i = 0; i < 3; i++) {
        this.drawLine(0, temp * (i + 1), this.data.width, temp * (i + 1), '#ddd')
      }
    },
    drawSingle(x, high, y1, y2, low, color) {
      this.drawLine(x, low, x, y2, color)
      this.drawLine(x, y1, x, high, color)
      this.drawRect(x, y1, y2, color)
    },
    drawLine(x, y, X, Y, color) {
      this.data.context.strokeStyle = color;
      this.data.context.beginPath();
      this.data.context.moveTo(x, y);
      this.data.context.lineTo(X, Y);
      this.data.context.stroke();
      this.data.context.closePath();
    },
    drawRect(x1, y1, y2, color) {
      this.data.context.beginPath()
      this.data.context.rect(x1 - (this.data.rectWidth / 2), y1, this.data.rectWidth, y2 - y1)
      this.data.context.fillStyle = color
      this.data.context.fill()
      this.data.context.closePath()
    },
    computeY(value) {
      let yRange = this.data.yRange
      let yDomain = this.data.yDomain
      return (yDomain[1] - parseFloat(value)) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
    },
    // 前复权
    beforeRf() {
      this.data.beforeRf = true
      if (this.data.data.rf && this.data.data.rf.length > 0 && this.data.width && this.data.height) {
        this.processData()
        this.draw()
      }
    },
    // 取消前复权
    cancelRf() {
      this.data.beforeRf = false
      if (this.data.data.rf && this.data.data.rf.length > 0 && this.data.width && this.data.height) {
        this.processData()
        this.draw()
      }
    },
    drawMoveAvg(days, color) {
      let data
      let start = this.data.start - days + 1
      if (this.data.beforeRf) {
        data = this.data.data.beforeRf.slice(start < 0 ? 0 : start, this.data.end)
      } else {
        data = this.data.data.rf.slice(start < 0 ? 0 : start, this.data.end)
      }
      let lineArr = []
      for (let i = days - 1; i < data.length; i++) {
        let value = 0
        for (let j = 0; j < days; j++) {
          value += +data[i - j].price
        }
        lineArr.push({
          date: data[i].date,
          value: value / days
        })
        if (this.data.yDomain[0] > (value / days)) {
          this.data.yDomain[0] = value / days
        }
        if (this.data.yDomain[1] < (value / days)) {
          this.data.yDomain[1] = value / days
        }
      }
      if (start < 0) {
        for (let i = 0; i < -start; i++) {
          lineArr.unshift({})
        }
      }
      this.data.lineArr[days] = lineArr
      // this.drawBrokeLine(lineArr, color)
    },
    drawCostAvg(days, color) {
      let data
      let start = this.data.start - days + 1
      if (this.data.beforeRf) {
        data = this.data.data.beforeRf.slice(start < 0 ? 0 : start, this.data.end)
      } else {
        data = this.data.data.rf.slice(start < 0 ? 0 : start, this.data.end)
      }
      let lineArr = []
      for (let i = days - 1; i < data.length; i++) {
        let AMOV = 0,
          hand = 0
        for (let j = 0; j < days; j++) {
          AMOV += +data[i - j].volume * (+data[i - j].open + +data[i - j].price) / 2
          hand += +data[i - j].volume
        }
        lineArr.push({
          date: data[i].date,
          value: AMOV / hand
        })
        if (this.data.yDomain[0] > (AMOV / hand)) {
          this.data.yDomain[0] = AMOV / hand
        }
        if (this.data.yDomain[1] < (AMOV / hand)) {
          this.data.yDomain[1] = AMOV / hand
        }
      }
      this.data.lineArr['cost' + days] = lineArr
    },
    drawBrokeLine(lineArr, color) {
      let first = true
      this.data.context.strokeStyle = color
      this.data.context.beginPath();
      for (let k = 0; k < lineArr.length; k++) {
        if (lineArr[k].value) {
          if (first) {
            this.data.context.moveTo(this.data.xDomain[k], this.computeY(+lineArr[k].value));
            first = false
          } else {
            this.data.context.lineTo(this.data.xDomain[k], this.computeY(+lineArr[k].value));
            this.data.context.moveTo(this.data.xDomain[k], this.computeY(+lineArr[k].value));
          }
        }
      }
      this.data.context.closePath()
      this.data.context.stroke()
    },
    moveData(direction) {
      this.data.clickBtn = true
      this.data.moveDirection = direction
      this.data.crosshairDate = null
      this.data.showCrosshair = false
      EventBus.emit('closecrosshair')
      this.processData()
      this.draw()
    },
    moveCrosshairByBtn(direction) {
      let type
      switch (this.data.selectIndex) {
        case 2:
          type = 'kline'
          break
        case 3:
          type = 'k5line'
          break
        case 4:
          type = 'k30line'
          break
        case 5:
          type = 'kweekline'
          break
      }
      let width = this.data.rectInterval + this.data.rectWidth
      let index = this.data.currentIndex
      if (this.data.end === this.data.data.rf.length && direction === 'right' && index === this.data.needData.length - 1) {
        return
      }
      if (direction === 'left') {
        index -= 1
      } else {
        index += 1
      }
      this.data.currentIndex = index
      let realX = width * index + this.data.rectWidth / 2

      if (realX < 0) {
        this.data.stepMove = 1
        this.data.moveDirection = 'left'
        this.processData()
      } else if (realX > (this.data.realCount - 1) * width + this.data.rectWidth / 2) {
        this.data.stepMove = 1
        this.data.moveDirection = 'right'
        this.processData()
      } else {
        EventBus.emit('movecrosshair', {
          x: realX,
          type,
        })
      }


    },
    moveLeft: throttle(function () {
      let direction = 'left'
      if (this.data.showCrosshair) {
        this.moveCrosshairByBtn(direction)
      } else {
        this.moveData(direction)
      }
    }, 500),
    moveRight: throttle(function () {
      let direction = 'right'
      if (this.data.showCrosshair) {
        this.moveCrosshairByBtn(direction)
      } else {
        this.moveData(direction)
      }
    }, 500),
    bindBoost: throttle(function () {
      this.data.clickBtn = true
      if (this.data.sizeLevel < 7) {
        this.data.sizeLevel++
        EventBus.emit('changesizelevel', this.data.sizeLevel)
        this.processData()

        this.draw()
      }
    }, 500),
    bindNarrow: throttle(function () {
      this.data.clickBtn = true
      if (this.data.sizeLevel > 0) {
        this.data.sizeLevel--

        EventBus.emit('changesizelevel', this.data.sizeLevel)
        this.processData()
        this.draw()
      }
    }, 500)
  }
})
