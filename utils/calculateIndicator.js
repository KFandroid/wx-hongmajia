import Utils from 'util.js'
const app = getApp()
module.exports = {
    /**
   * 随机指标KDJ 
   * @returns {Array|*|plot.stochastic}
   */
  calculateKDJ(data) { // 9,3,3
    
    const kLines = data
    const kdjParam = [9, 3, 3]
    kdjParam[0] = app.globalData.indicatorSetting.kdj1
    let stochastic = []

    let LnP = 0  // n日内最低价(默认为9天)
    let HnP = 0  // n日内最高价
    let CnP = 0  // 第n日的收盘价
    for (let i = 0; i < kLines.length; i++) {
      let stoObj = Object.assign({}, kLines[i])

      LnP = parseFloat(kLines[i].low)
      HnP = parseFloat(kLines[i].high)
      CnP = parseFloat(kLines[i].price)
      for (let p = Math.max(0, i - (kdjParam[0] - 1)); p < i; p++) {
        if (kLines[p].low < LnP) {
          LnP = kLines[p].low
        }
        if (kLines[p].high > HnP) {
          HnP = kLines[p].high
        }
      }

      if (i === 0) {
        stoObj.Kvalue = Utils.calculateKvalue(50, Utils.calculateRSVn(CnP, HnP, LnP), kdjParam[1])
        stoObj.Dvalue = Utils.calculateDvalue(50, stoObj.Kvalue, kdjParam[2])
      } else {
        stoObj.Kvalue = Utils.calculateKvalue(stochastic[i - 1].Kvalue, Utils.calculateRSVn(CnP, HnP, LnP), kdjParam[1])
        stoObj.Dvalue = Utils.calculateDvalue(stochastic[i - 1].Dvalue, stoObj.Kvalue, kdjParam[2])
      }
      stoObj.Jvalue = Utils.calculateJvalue(stoObj.Kvalue, stoObj.Dvalue)
      stochastic.push(stoObj)
    }

    return stochastic
  },
  /**
   * 相对强弱指标 （快照）
   * @returns {Array}
   */
  calculateRelativeStrength(data) { // 6,12,24(需用到除权因子)
    const dayLines = data
    const rsiParam = [6, 12, 24]
    
    rsiParam[0] = app.globalData.indicatorSetting.rsi1
    rsiParam[1] = app.globalData.indicatorSetting.rsi2
    rsiParam[2] = app.globalData.indicatorSetting.rsi3
    let relativeStrength = []

    for (let i = 0; i < dayLines.length; i++) {
      let relStrObj = Object.assign({}, dayLines[i])
      if (i === 0) {
        relStrObj.g1 = 0
        relStrObj.d1 = 0
        relStrObj.g2 = 0
        relStrObj.d2 = 0
        relStrObj.g3 = 0
        relStrObj.d3 = 0
        relStrObj.RSI = 0
        relStrObj.RSI2 = 0
        relStrObj.RSI3 = 0
      } else {
        let gdCurrent = dayLines[i].price - dayLines[i - 1].price
        if (gdCurrent > 0) {
          relStrObj.g1 = (relativeStrength[i - 1].g1 * (rsiParam[0] - 1) + gdCurrent) / rsiParam[0]
          relStrObj.d1 = (relativeStrength[i - 1].d1 * (rsiParam[0] - 1) + gdCurrent) / rsiParam[0]

          relStrObj.g2 = (relativeStrength[i - 1].g2 * (rsiParam[1] - 1) + gdCurrent) / rsiParam[1]
          relStrObj.d2 = (relativeStrength[i - 1].d2 * (rsiParam[1] - 1) + gdCurrent) / rsiParam[1]

          relStrObj.g3 = (relativeStrength[i - 1].g3 * (rsiParam[2] - 1) + gdCurrent) / rsiParam[2]
          relStrObj.d3 = (relativeStrength[i - 1].d3 * (rsiParam[2] - 1) + gdCurrent) / rsiParam[2]
        } else {
          relStrObj.g1 = relativeStrength[i - 1].g1 * (rsiParam[0] - 1) / rsiParam[0]
          relStrObj.d1 = (relativeStrength[i - 1].d1 * (rsiParam[0] - 1) - gdCurrent) / rsiParam[0]

          relStrObj.g2 = relativeStrength[i - 1].g2 * (rsiParam[1] - 1) / rsiParam[1]
          relStrObj.d2 = (relativeStrength[i - 1].d2 * (rsiParam[1] - 1) - gdCurrent) / rsiParam[1]

          relStrObj.g3 = relativeStrength[i - 1].g3 * (rsiParam[2] - 1) / rsiParam[2]
          relStrObj.d3 = (relativeStrength[i - 1].d3 * (rsiParam[2] - 1) - gdCurrent) / rsiParam[2]
        }

        relStrObj.RSI = relStrObj.g1 / relStrObj.d1 * 100
        relStrObj.RSI2 = relStrObj.g2 / relStrObj.d2 * 100
        relStrObj.RSI3 = relStrObj.g3 / relStrObj.d3 * 100
      }

      relativeStrength.push(relStrObj)
    }

    return relativeStrength
  },
  calculateBoll(data, period) {
    let bollIndicators = []
    const dayLines = data
    const bollParam = [20, 2]
    bollParam[0] = app.globalData.indicatorSetting.boll1
    bollParam[1] = app.globalData.indicatorSetting.boll2
    for (let i = 0; i < dayLines.length; i++) {
      let biObj = Object.assign({}, dayLines[i])
      // biObj.timestamp = dayLines[i].timestamp   // 毫秒时间戳
      // biObj.tradeTime = dayLines[i].tradeTime   // 时间格式 （2012-12-25）
      // biObj.date = dayLines[i].date

      let sumA = dayLines[i].price  // N日内的收盘价之和
      for (let c = Math.max(0, i - (bollParam[0] - 1)); c < i; c++) {
        sumA += dayLines[c].price
      }
      if (i >= (bollParam[0] - 1)) {
        biObj.MA = sumA / bollParam[0]
      } else {
        biObj.MA = sumA / (i + 1)
      }
      biObj.price = dayLines[i].price
      bollIndicators.push(biObj)
    }

    for (let b = 0; b < bollIndicators.length; b++) {
      let CMA = Math.pow(bollIndicators[b].price - bollIndicators[b].MA, 2)   // N日的（C－MA）的两次方之和
      for (let m = Math.max(0, b - (bollParam[0] - 1)); m < b; m++) {
        CMA += Math.pow(bollIndicators[m].price - bollIndicators[b].MA, 2)
      }
      if (b >= (bollParam[0] - 1)) {
        bollIndicators[b].CMDavg = Math.sqrt(CMA / bollParam[0]) // 平方根
      } else {
        bollIndicators[b].CMDavg = Math.sqrt(CMA / (b + 1))
      }
      bollIndicators[b].MB = bollIndicators[b].MA
      if (b === 0) {
        bollIndicators[b].UP = 0
        bollIndicators[b].DN = 0
      } else {
        bollIndicators[b].UP = bollIndicators[b].MA + bollParam[1] * bollIndicators[b].CMDavg
        bollIndicators[b].DN = bollIndicators[b].MA - bollParam[1] * bollIndicators[b].CMDavg
      }
    }
    
    return bollIndicators
  }, 
  /**
   * 威廉指标
   * @returns {Array|*|plot.stochastic}
   */
  calculateWR(data) { // 10,6
    const kLines = data
    const wrParam = [10, 6]
    wrParam[0]  =app.globalData.indicatorSetting.wr1
    wrParam[1]  =app.globalData.indicatorSetting.wr2
    let wlIndicators = []

    let highp1 = 0 // 是过去n日内的最高价（默认为10天）
    let lowp1 = 0  // 是过去n日内的最低价

    let highp2 = 0 // 是过去n日内的最高价（默认为6天）
    let lowp2 = 0  // 是过去n日内的最低价
    for (let i = 0; i < kLines.length; i++) {
      let wiObj = Object.assign({}, kLines[i])
      

      highp1 = kLines[i].high
      lowp1 = kLines[i].low
      for (let p = Math.max(0, i - (wrParam[0] - 1)); p < i; p++) {
        if (kLines[p].high > highp1) {
          highp1 = kLines[p].high
        }
        if (kLines[p].low < lowp1) {
          lowp1 = kLines[p].low
        }
      }

      highp2 = kLines[i].high
      lowp2 = kLines[i].low
      for (let p2 = Math.max(0, i - (wrParam[1] - 1)); p2 < i; p2++) {
        if (kLines[p2].high > highp2) {
          highp2 = kLines[p2].high
        }
        if (kLines[p2].low < lowp2) {
          lowp2 = kLines[p2].low
        }
      }
      wiObj.wr = Utils.calculateWR(kLines[i].price, highp1, lowp1)
      wiObj.wr2 = Utils.calculateWR(kLines[i].price, highp2, lowp2)
      wlIndicators.push(wiObj)
    }
    return wlIndicators
  },
  /**
  * 乖离率指标
  * @returns {Array}
  */
 calculateBiasIndicators(data) { // 6,12,24
   let biasIndicators = []
   const dayLines = data
   const biasParam = [6, 12, 24]
   biasParam[0]  =app.globalData.indicatorSetting.bias1
   biasParam[1]  =app.globalData.indicatorSetting.bias2
   biasParam[2]  =app.globalData.indicatorSetting.bias3
   for (let i = 0; i < dayLines.length; i++) {
     let biObj = Object.assign({}, dayLines[i])
     

     let SumClose1 = dayLines[i].price // N日内的收盘价之和
     for (let s1 = Math.max(0, i - (biasParam[0] - 1)); s1 < i; s1++) {
       SumClose1 += dayLines[s1].price
     }
     if (i >= biasParam[0] - 1) {
       biObj.BIAS = (dayLines[i].price- SumClose1 / biasParam[0]) / (SumClose1 / biasParam[0]) * 100
     } else {
       biObj.BIAS = (dayLines[i].price- SumClose1 / (i + 1)) / (SumClose1 / (i + 1)) * 100
     }

     let SumClose2 = dayLines[i].price// N日内的收盘价之和
     for (let s2 = Math.max(0, i - (biasParam[1] - 1)); s2 < i; s2++) {
       SumClose2 += dayLines[s2].price
     }
     if (i >= biasParam[1] - 1) {
       biObj.BIAS2 = (dayLines[i].price- SumClose2 / biasParam[1]) / (SumClose2 / biasParam[1]) * 100
     } else {
       biObj.BIAS2 = (dayLines[i].price- SumClose2 / (i + 1)) / (SumClose2 / (i + 1)) * 100
     }

     let SumClose3 = dayLines[i].price// N日内的收盘价之和
     for (let s3 = Math.max(0, i - (biasParam[2] - 1)); s3 < i; s3++) {
       SumClose3 += dayLines[s3].price
     }
     if (i >= biasParam[2] - 1) {
       biObj.BIAS3 = (dayLines[i].price- SumClose3 / biasParam[2]) / (SumClose3 / biasParam[2]) * 100
     } else {
       biObj.BIAS3 = (dayLines[i].price- SumClose3 / (i + 1)) / (SumClose3 / (i + 1)) * 100
     }

     biasIndicators.push(biObj)
   }
   
   return biasIndicators
 }
}