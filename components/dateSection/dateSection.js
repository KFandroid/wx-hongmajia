const date = new Date()
const years = []
const months = []
const days = []
const monthShort = [4, 6, 9, 11]
const monthLong = [1, 3, 5, 7, 8, 10, 12]
const longDays = []
const shortDays = []
const longFeb = []
const shortFeb = []
const getMonthDays = function(year, month) {
  if (month === 2) {
    if (year % 4 !== 0) {
      return shortFeb
    } else {
      return longFeb
    }
  } else if (monthLong.indexOf(month) > -1) {
    return longDays
  } else if (monthShort.indexOf(month) > -1) {
    return shortDays
  }
}
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  longDays.push(i)
}

for (let i = 1; i <= 30; i++) {
  shortDays.push(i)
}

for (let i = 1; i <= 29; i++) {
  longFeb.push(i)
}

for (let i = 1; i <= 28; i++) {
  shortFeb.push(i)
}

function keep2digit(num) {
  return String(100 + num).slice(1)
}

function generateDate(year, month, day) {

  return [year, keep2digit(month), keep2digit(day)].join('-')
}

function compareDate(startDate, endDate) {
  if (Number(startDate.split('-').join('')) >= Number(endDate.split('-').join(''))) {
    return false
  } else {
    return true
  }
}

Component({
  properties: {
    bottomVal: {
      type: Number,
      value: 0
    },
    modalTopVal: {
      type: Number,
      value: 0
    }
    // show: {
    //   type: Boolean,
    //   value: false,
    // },
    // cancelEvent: {
    //   type: String,
    // }
  },
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    startDate: '2017-11-22',
    endDate: '2018-11-26',
    tempStartDate: '2017-11-22',
    tempEndDate: '2018-11-26',
    startDays: days,
    endDays: days,
    day: 2,
    show: false,
    value: [0, 0, 0, 0, 9999, 0, 0],
  },
  lifetimes: {
    // ready: function () {
    //   const query = wx.createSelectorQuery()
    //   query.select('.datePickerContainer').boundingClientRect()
    //   query.selectViewport().scrollOffset()
    //   query.exec(function (res) {
    //     ('res is', res)
    //   })
    //   ('Yes I am ready')
    // },
  },
  methods: {
    myCatchTouch: function() {
      return;
    },
    cancel: function() {
      this.setData({
        show: false
      })
      // (this.properties.cancelEvent)
    },
    confirm: function() {
      if (compareDate(this.data.tempStartDate, this.data.tempEndDate)) {
        this.setData({
          show: false,
          startDate: this.data.tempStartDate,
          endDate: this.data.tempEndDate
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '开始时间需大于结束时间！',
          success(res) {
            if (res.confirm) {} else if (res.cancel) {}
          }
        })
      }
    },
    pickerStyle: function(e) {
      return 'width: 100%; height: 300px;'
    },
    showDatePicker: function(e) {
      this.setData({
        show: true
      })
    },
    bindChange: function(e) {
      const val = e.detail.value
      const startDays = getMonthDays(this.data.years[val[0]], this.data.months[val[1]])
      const endDays = getMonthDays(this.data.years[val[4]], this.data.months[val[5]])
      this.setData({
        startDays,
        endDays
      })
      this.setData({
        value: val,
        tempStartDate: generateDate(this.data.years[val[0]], this.data.months[val[1]], this.data.startDays[val[2]]),
        tempEndDate: generateDate(this.data.years[val[4]], this.data.months[val[5]], this.data.endDays[val[6]]),
      })
    }
  }
})