// components/tradeDateSelector/tradeDateSelector.js
const addZero = function (code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  return code.join('')
}
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    secondDays: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0],
    dateArr: [],
    multiArrayShow: [],
    multiIndexShow: [0, 0, 0]
  },
  lifetimes: {
    attached() {
      
      this.data.dateArr = app.globalData.a109.data
      
      let yearArr = []
      for (let i = 0; i < this.data.dateArr.length; i++) {
        let flag = true
        for (let j = 0; j < yearArr.length; j++) {
          if (yearArr[j] == this.data.dateArr[i].year) {
            flag = false
          }
        }
        if (flag) {
          yearArr.push(this.data.dateArr[i].year)
        }
      }
      this.data.multiArray.push(yearArr.reverse())

      let tempYear = []
      for (let i = 0; i < this.data.dateArr.length; i++) {
        if (this.data.dateArr[i].year == this.data.multiArray[0][this.data.multiIndex[0]]) {
          tempYear.push(this.data.dateArr[i])
        }
      }
      let monthArr = []
      for (let i = 0; i < tempYear.length; i++) {
        let flag = true
        for (let j = 0; j < monthArr.length; j++) {
          if (monthArr[j] == tempYear[i].month) {
            flag = false
          }
        }
        if (flag) {
          monthArr.push(tempYear[i].month)
        }
      }
      this.data.multiArray.push(monthArr.reverse())

      let tempMonth = []
      for (let i = 0; i < tempYear.length; i++) {
        if (tempYear[i].month == this.data.multiArray[1][this.data.multiIndex[1]]) {
          tempMonth.push(tempYear[i])
        }
      }
      let dayArr = []
      for (let i = 0; i < tempMonth.length; i++) {
        let flag = true
        for (let j = 0; j < dayArr.length; j++) {
          if (dayArr[j] == tempMonth[i].day) {
            flag = false
          }
        }
        if (flag) {
          dayArr.push(tempMonth[i].day)
        }
      }
      this.data.multiArray.push(dayArr.reverse())
      this.setData({
        multiArray: this.data.multiArray,
        multiArrayShow: this.data.multiArray
      })
      if (this.data.secondDays) {
        if (dayArr.length > 1) {
          this.setData({
            multiIndex: [0, 0, 1],
            multiIndexShow: [0, 0, 1]
          })
        } else {
          this.setData({
            multiIndex: [0, 1, 0],
            multiIndexShow: [0, 1, 0]
          })

          let tempYear = []
          for (let i = 0; i < this.data.dateArr.length; i++) {
            if (this.data.dateArr[i].year == this.data.multiArray[0][this.data.multiIndex[0]]) {
              tempYear.push(this.data.dateArr[i])
            }
          }
          let monthArr = []
          for (let i = 0; i < tempYear.length; i++) {
            let flag = true
            for (let j = 0; j < monthArr.length; j++) {
              if (monthArr[j] == tempYear[i].month) {
                flag = false
              }
            }
            if (flag) {
              monthArr.push(tempYear[i].month)
            }
          }
          this.data.multiArray[1] = monthArr.reverse()

          let tempMonth = []
          for (let i = 0; i < tempYear.length; i++) {
            if (tempYear[i].month == this.data.multiArray[1][this.data.multiIndex[1]]) {
              tempMonth.push(tempYear[i])
            }
          }
          let dayArr = []
          for (let i = 0; i < tempMonth.length; i++) {
            let flag = true
            for (let j = 0; j < dayArr.length; j++) {
              if (dayArr[j] == tempMonth[i].day) {
                flag = false
              }
            }
            if (flag) {
              dayArr.push(tempMonth[i].day)
            }
          }
          this.data.multiArray[2] = dayArr.reverse()
          this.setData({
            multiArray: this.data.multiArray,
            multiArrayShow: this.data.multiArrayShow
          })
        }
        this.triggerEvent('bindGetDate', this.data.multiArrayShow[0][this.data.multiIndexShow[0]] + '-' + addZero(this.data.multiArrayShow[1][this.data.multiIndexShow[1]], 2) + '-' + addZero(this.data.multiArrayShow[2][this.data.multiIndexShow[2]], 2))
      } else {
        this.triggerEvent('bindGetDate', this.data.multiArrayShow[0][this.data.multiIndexShow[0]] + '-' + addZero(this.data.multiArrayShow[1][this.data.multiIndexShow[1]], 2) + '-' + addZero(this.data.multiArrayShow[2][this.data.multiIndexShow[2]], 2))
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindMultiPickerColumnChange(e) {
      this.data.multiIndex[e.detail.column] = e.detail.value
      if (e.detail.column == 0) {
        this.data.multiIndex[1] = 0
        this.data.multiIndex[2] = 0
        let tempYear = []
        for (let i = 0; i < this.data.dateArr.length; i++) {
          if (this.data.dateArr[i].year == this.data.multiArray[0][this.data.multiIndex[0]]) {
            tempYear.push(this.data.dateArr[i])
          }
        }
        let monthArr = []
        for (let i = 0; i < tempYear.length; i++) {
          let flag = true
          for (let j = 0; j < monthArr.length; j++) {
            if (monthArr[j] == tempYear[i].month) {
              flag = false
            }
          }
          if (flag) {
            monthArr.push(tempYear[i].month)
          }
        }
        this.data.multiArray[1] = monthArr.reverse()

        let tempMonth = []
        for (let i = 0; i < tempYear.length; i++) {
          if (tempYear[i].month == this.data.multiArray[1][this.data.multiIndex[1]]) {
            tempMonth.push(tempYear[i])
          }
        }
        let dayArr = []
        for (let i = 0; i < tempMonth.length; i++) {
          let flag = true
          for (let j = 0; j < dayArr.length; j++) {
            if (dayArr[j] == tempMonth[i].day) {
              flag = false
            }
          }
          if (flag) {
            dayArr.push(tempMonth[i].day)
          }
        }
        this.data.multiArray[2] = dayArr.reverse()
      } else if (e.detail.column == 1) {
        this.data.multiIndex[2] = 0
        let tempYear = []
        for (let i = 0; i < this.data.dateArr.length; i++) {
          if (this.data.dateArr[i].year == this.data.multiArray[0][this.data.multiIndex[0]]) {
            tempYear.push(this.data.dateArr[i])
          }
        }

        let tempMonth = []
        for (let i = 0; i < tempYear.length; i++) {
          if (tempYear[i].month == this.data.multiArray[1][this.data.multiIndex[1]]) {
            tempMonth.push(tempYear[i])
          }
        }
        let dayArr = []
        for (let i = 0; i < tempMonth.length; i++) {
          let flag = true
          for (let j = 0; j < dayArr.length; j++) {
            if (dayArr[j] == tempMonth[i].day) {
              flag = false
            }
          }
          if (flag) {
            dayArr.push(tempMonth[i].day)
          }
        }
        this.data.multiArray[2] = dayArr.reverse()
      }
      this.setData({
        multiIndex: this.data.multiIndex,
        multiArray: this.data.multiArray
      })
    },
    bindchange(e) {
      this.setData({
        multiIndexShow: Object.assign([], this.data.multiIndex),
        multiArrayShow: Object.assign([], this.data.multiArray)
      })
      this.triggerEvent('bindGetDate', this.data.multiArrayShow[0][this.data.multiIndexShow[0]] + '-' + addZero(this.data.multiArrayShow[1][this.data.multiIndexShow[1]], 2) + '-' + addZero(this.data.multiArrayShow[2][this.data.multiIndexShow[2]], 2))
    },
    bindcancel() {
      this.setData({
        multiIndex: Object.assign([], this.data.multiIndexShow),
        multiArray: Object.assign([], this.data.multiArrayShow)
      })
    }
  }
})
