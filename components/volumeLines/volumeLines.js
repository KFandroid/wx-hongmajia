import debounce from '../../utils/debounce.js'
import EventBus from '../../utils/pubsub.js'
import {
  throttle
} from '../../utils/util.js'
import {
  getNumUnit
} from '../../utils/changeUnit.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectIndex: {
      type: Number,
      value: null,
      observer(index) {
        let type
        switch (index) {
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
        this.data.key = type
      }
    },
    height: {
      type: Number,
      value: 300,
      observer(newData) {
        this.setData({
          yRange: [0, newData - this.data.paddingBottom]
        })
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          this.draw()
        }
      }
    },
    start: {
      type: Number,
      value: 0,
      observer(newData) {
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          this.draw()
        }
      }
    },
    rectWidth: {
      type: Number,
      value: 1,
      observer(newData) {
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          this.draw()
        }
      }
    },
    rectInterval: {
      type: Number,
      value: 1,
      observer(newData) {
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          this.draw()
        }
      }
    },
    end: {
      type: Number,
      value: 0,
      observer(newData) {
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
          this.processData()
          this.draw()
        }
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {
        if (newData > 0 && this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
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

            newData.data = newData.data.concat(oldData.data)
          }
          this.data.firstInit = true


          if (oldData.page !== newData.page) {
            this.setData({
              data: {
                rf: newData.data
              },
              count: 0,
              newCount: 0
            })
            // if (oldData.data && oldData.page !== newData.page) {
            if (newData.data) {
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

        if (newData && this.data.data.rf && newData.data) {
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
              }
            }
          }
          if (Object.keys(this.data.data.rf).length !== 0) {
            this.processData()

            this.draw()
          }
        }
      }
    },
    rfArr: {
      type: Object,
      value: {}
    },
    kSettingItem: {
      type: Object,
      value: []
    },
    key: {
      type: String,
      value: 'kline',
      observer() {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    paddingBottom: 0,
    lineWidth: 1,
    xDomain: [],
    yRange: [],
    yDomain: [],
    data: {},
    context: null,
    count: 0,
    showCrosshair: false,
    needData: {},
    beforeRf: true,
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
    detached() { }
  },
  methods: {
    clearCanvas() {

      let ctx = wx.createCanvasContext('myCanvas', this)
      ctx.draw()
    },
    drawCrossHair(x) {
      this.setData({
        showCrosshair: true,
        crossX: x
      })
      this.draw()
    },
    closeCrosshair() {
      this.setData({
        showCrosshair: false
      })
      if (Object.keys(this.data.data).length !== 0 && Object.keys(this.data.data.rf).length !== 0) {
        this.draw()
      }
    },
    longTapMove: debounce(function (e, isDate = false) {
      let x
      x = e.changedTouches[0].x
      let width = this.data.rectInterval + this.data.rectWidth
      let index = Math.floor(x / width)
      if (index < 0) {
        index = 0
      }
      let realX = index * width + this.data.rectWidth / 2

      EventBus.emit('movecrosshair', { x: realX, type: this.data.key })
    }, 0),
    moveCrosshair(crosshairPosition) {

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
      let width = this.data.rectInterval + this.data.rectWidth
      let index = Math.floor(x / width)
      if (index < 0) {
        index = 0
      }
      if (index >= this.data.needData.length) {
        index = this.data.needData.length - 1
      }
      let realX = index * width + this.data.rectWidth / 2
      this.setData({
        showCrosshair: true,
        crossX: realX
      })
      this.draw()
    },
    processData() {
      if (this.data.beforeRf) {
        this.processRf()
      }
      this.data.context.lineWidth = this.data.lineWidth;
      this.data.context.fillStyle = "#000";
      let count = this.data.count = Math.floor(this.data.width / (this.data.rectWidth + this.data.rectInterval))


      if (this.data.beforeRf) {
        this.data.needData = this.data.data.beforeRf.slice(this.data.start, this.data.end)
      } else {
        this.data.needData = this.data.data.rf.slice(this.data.start, this.data.end)
      }
      if (this.data.needData.length > 0) {
        let max = +this.data.needData[0].volume
        for (let i = 0; i < this.data.needData.length; i++) {
          this.data.xDomain[i] = (this.data.rectWidth + this.data.rectInterval) * i + (this.data.rectWidth / 2)
          if (+this.data.needData[i].volume > max) max = +this.data.needData[i].volume
        }
        this.data.yDomain = [0, max]
      }
    },
    processRf() {
      let data = this.data.data.rf
      let rf = 1
      let temp = this.data.data.beforeRf = JSON.parse(JSON.stringify(this.data.data.rf))
      for (let i = temp.length - 1; i >= 0; i--) {
        let flag = true
        for (let j = 0; j < this.data.rfArr.length; j++) {
          if (temp[i].date == this.data.rfArr[j].date) {
            temp[i].rf = +this.data.rfArr[j].rf
            flag = false
          }
        }
        if (flag) {
          temp[i].rf = 1
        }
        temp[i].high = temp[i].high * rf
        temp[i].low = temp[i].low * rf
        temp[i].price = temp[i].price * rf
        temp[i].open = temp[i].open * rf
        temp[i].volume = temp[i].volume / rf
        rf *= temp[i].rf
      }
    },
    draw() {
      this.calculateAvg()
      for (let i = 0; i < this.data.needData.length; i++) {
        let temp = this.data.needData[i]
        let volume = this.computeY(this.data.needData[i].volume)
        let color = '#000'
        if (this.data.needData[i].price > this.data.needData[i].open) {
          color = 'red'
        } else {
          color = 'green'

        }
        this.drawRect(this.data.xDomain[i], volume, this.data.height - this.data.paddingBottom, color)
      }
      if (this.data.showCrosshair) {
        this.data.context.beginPath()
        this.data.context.setStrokeStyle('gray')
        this.data.context.moveTo(this.data.crossX, this.data.yRange[0])
        this.data.context.lineTo(this.data.crossX, this.data.yRange[1])
        this.data.context.stroke()
        this.data.context.closePath()
      }
      this.data.context.draw()
    },
    calculateAvg() {
      if (this.data.kSettingItem) {
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(5) > -1) this.drawVolumeAvg(5, '#8B8B8B')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(10) > -1) this.drawVolumeAvg(10, '#E3BC05')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(20) > -1) this.drawVolumeAvg(20, '#7927A9')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(30) > -1) this.drawVolumeAvg(30, '#00B050')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(60) > -1) this.drawVolumeAvg(60, '#E3BC05')

        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(5) > -1) this.drawBrokeLine(this.data.lineArr[5], '#8B8B8B')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(10) > -1) this.drawBrokeLine(this.data.lineArr[10], '#E3BC05')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(20) > -1) this.drawBrokeLine(this.data.lineArr[20], '#7927A9')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(30) > -1) this.drawBrokeLine(this.data.lineArr[30], '#00B050')
        if (this.data.kSettingItem.cjljx.show == true && this.data.kSettingItem.cjljx.period.indexOf(60) > -1) this.drawBrokeLine(this.data.lineArr[60], '#E3BC05')
      }
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
      return (yDomain[1] - value) / (yDomain[1] - yDomain[0]) * (yRange[1] - yRange[0]) + yRange[0]
    },
    // 前复权
    beforeRf() {
      this.setData({
        beforeRf: true
      })
      if (this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
        this.processData()
        this.draw()
      }
    },
    // 取消前复权
    cancelRf() {
      this.setData({
        beforeRf: false
      })
      if (this.data.kLinesData.data && this.data.kLinesData.data.length > 0) {
        this.processData()
        this.draw()
      }
    },
    drawVolumeAvg(days, color) {
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
          value += +data[i - j].volume
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
      this.data.lineArr[days] = lineArr
      // this.drawBrokeLine(lineArr, color)
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
    }
  }
})