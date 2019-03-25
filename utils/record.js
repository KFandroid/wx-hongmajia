function recordTime(key) {
  let timeTable = wx.getStorageSync('timeTable')
  if(!timeTable) {
    timeTable = {}
  }
  timeTable[key] = +new Date()
  wx.setStorageSync('timeTable', timeTable)
}

module.exports = {
  recordTime
}
