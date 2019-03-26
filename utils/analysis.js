import {
  utf8ByteArrayToString
} from './crypt.js'
import {
  getNumUnit
} from './changeUnit.js'
import {
  formatDate2,
  formatSmallNumber
} from './util.js'

const addZero = function(code, zeroNum) {
  code = String(code).split('')
  let leftZero = zeroNum - code.length
  for (let i = 0; i < leftZero; i++) {
    code.unshift('0')
  }
  1
  return code.join('')
}

const toTable107 = function(stockTableView) {
  let data = {
    data: []
  }
  data.timestamp = stockTableView.getInt32(10)
  data.type = '107'
  data.id = stockTableView.getInt32(22)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (stockTableView.byteLength > 32) {
    let obj = {}
    obj.code = stockTableView.getInt32(order)
    order += 4
    obj.cjj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zsj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zf = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.kpj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zgj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zdj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.cjl = getNumUnit(Math.round((stockTableView.getFloat32(order))))
    order += 4
    obj.cje = getNumUnit(Math.round((stockTableView.getFloat32(order))))
    order += 4
    let strArr = [];
    for (let i = 0; i < 17; i++) {
      strArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.time = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable108 = function(dataView) {
  const data = {}
  data.type = '108'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = '0000'
  data.data = {}
  let temp = {}
  const offset = 32
  temp.stockCode = addZero(dataView.getInt32(offset), 6)
  temp.current = dataView.getFloat32(offset + 4).toFixed(2)
  temp.close = dataView.getFloat32(offset + 8).toFixed(2)
  temp.rise = dataView.getFloat32(offset + 12).toFixed(2)
  temp.open = dataView.getFloat32(offset + 16).toFixed(2)
  temp.high = dataView.getFloat32(offset + 20).toFixed(2)
  temp.low = dataView.getFloat32(offset + 24).toFixed(2)
  temp.hand = getNumUnit(Math.round((dataView.getFloat32(offset + 28))))
  temp.volume = getNumUnit(Math.round((dataView.getFloat32(offset + 32))))
  let order = 68
  let strArr = []
  for (let i = 0; i < 17; i++) {
    strArr.push(dataView.getUint8(order))
    order += 1
  }
  temp.time = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
  data.data = temp
  return data
}

const toTable109 = function(dataView) {
  const data = {}
  data.type = '109'
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = '0000'
  data.data = []
  let order = 32
  while (true) {
    let childStrArr = []
    for (let j = 0; j < 10; j++) {
      childStrArr.push(dataView.getUint8(order))
      order += 1
    }
    let temp = utf8ByteArrayToString(childStrArr).split('-')
    data.data.push({
      year: +temp[0],
      month: +temp[1],
      day: +temp[2]
    })
    if (order >= dataView.byteLength) break;
  }
  return data
}

const toTable110 = function(dataView) {
  const data = {}
  data.type = '110'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = '0000'
  data.data = []
  data.pcp = dataView.getFloat32(32).toFixed(2)

  let dataByteLength
  dataByteLength = 10

  let itemLength = Math.round((dataView.byteLength - 36) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    let strArr = []

    for (let j = 0; j < 2; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 36))
    }
    temp.title = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    temp.price = dataView.getFloat32(i * dataByteLength + 36 + 2).toFixed(2)
    temp.num = Math.round(dataView.getFloat32(i * dataByteLength + 36 + 6))
    data.data.push(temp)
  }
  return data
}

const toTable122 = function(dataView) {
  const data = {}
  data.type = '122'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.pcp = dataView.getFloat32(32).toFixed(2)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = '0000'
  data.data = []
  // 时间14， 收盘价4，手数4，笔数2
  let dataByteLength
  dataByteLength = 24
  let itemLength = Math.round((dataView.byteLength - 36) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    let strArr = []
    for (let j = 0; j < 14; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 36))
    }
    temp.time = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    temp.price = dataView.getFloat32(i * dataByteLength + 36 + 14).toFixed(2)
    temp.hand = Math.round(dataView.getFloat32(i * dataByteLength + 36 + 18))
    temp.bill = Math.round(dataView.getInt16(i * dataByteLength + 36 + 22))
    data.data.push(temp)
  }
  return data
}
// 分时数据
const toTable112 = function(dataView) {
  const data = {}
  
  data.type = '112'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = '0000'
  data.data = []
  let dataByteLength
  dataByteLength = 16
  data.pcp = dataView.getFloat32(32).toFixed(2)
  data.hp = dataView.getFloat32(32 + 4).toFixed(2)
  data.lp = dataView.getFloat32(32 + 8).toFixed(2)
  let itemLength = Math.round((dataView.byteLength - 44) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    let strArr = []
    for (let j = 0; j < 4; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 44))
    }

    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    temp.dealPrice = dataView.getFloat32(i * dataByteLength + 44 + 4).toFixed(2)
    temp.dn = Math.round(dataView.getFloat32(i * dataByteLength + 44 + 8))
    temp.da = Math.round(dataView.getFloat32(i * dataByteLength + 44 + 12))
    data.data.push(temp)
  }
  
  return data
}
const toTable113 = function(dataView) {

  const data = {}
  data.type = '113'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.price = dataView.getFloat32(i * dataByteLength + 32).toFixed(2)
    temp.open = dataView.getFloat32(i * dataByteLength + 32 + 4).toFixed(2)
    temp.high = dataView.getFloat32(i * dataByteLength + 32 + 8).toFixed(2)
    temp.low = dataView.getFloat32(i * dataByteLength + 32 + 12).toFixed(2)
    // temp.rf = dataView.getFloat32(i * dataByteLength + 32 + 16).toFixed(2)
    temp.value = dataView.getFloat32(i * dataByteLength + 32 + 20).toFixed(2)
    temp.volume = dataView.getFloat32(i * dataByteLength + 32 + 24).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32 + 28))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}

const toTable114 = function(dataView) {
  const data = {}
  data.type = '114'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.price = dataView.getFloat32(i * dataByteLength + 32).toFixed(2)
    temp.open = dataView.getFloat32(i * dataByteLength + 32 + 4).toFixed(2)
    temp.high = dataView.getFloat32(i * dataByteLength + 32 + 8).toFixed(2)
    temp.low = dataView.getFloat32(i * dataByteLength + 32 + 12).toFixed(2)
    // temp.rf = dataView.getFloat32(i * dataByteLength + 32 + 16).toFixed(2)
    temp.value = dataView.getFloat32(i * dataByteLength + 32 + 20).toFixed(2)
    temp.volume = dataView.getFloat32(i * dataByteLength + 32 + 24).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32 + 28))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }

  return data
}

const toTable115 = function(dataView) {
  const data = {}
  data.type = '115'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 40
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 40).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 40 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 40 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 40 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 40 + 16).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 40 + 20).toFixed(2)
    let strArr = []
    for (let j = 0; j < 16; j++) {
      strArr.push(dataView.getUint8(32 + i * 40 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")

    data.data.push(temp)
  }
  return data
}

const toTable116 = function(dataView) {
  const data = {}
  data.type = '116'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 40
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 40).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 40 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 40 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 40 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 40 + 16).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 40 + 20).toFixed(2)
    let strArr = []
    for (let j = 0; j < 16; j++) {
      strArr.push(dataView.getUint8(32 + i * 40 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")

    data.data.push(temp)
  }


  return data
}
const toTable117 = function(dataView) {
  const data = {}
  data.type = '117'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 14
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.rf = dataView.getFloat32(i * dataByteLength + 32).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32 + 4))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}
const toTable118 = function(dataView) {
  const data = {}
  data.type = '118'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 40
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 40).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 40 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 40 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 40 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 40 + 16).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 40 + 20).toFixed(2)
    let strArr = []
    for (let j = 0; j < 16; j++) {
      strArr.push(dataView.getUint8(32 + i * 40 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }

  return data
}

const toTable119 = function(dataView) {
  const data = {}
  data.type = '119'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 40
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 40).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 40 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 40 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 40 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 40 + 16).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 40 + 20).toFixed(2)
    let strArr = []
    for (let j = 0; j < 16; j++) {
      strArr.push(dataView.getUint8(32 + i * 40 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }

  return data
}

const toStockTable = function(stockTableView) {
  const data = {}
  data.type = '105'
  data.code = addZero(stockTableView.getInt16(2), 3) + addZero(stockTableView.getInt16(4), 3)
  data.stockCode = '000000'
  data.date = '00000000'
  data.timestamp = addZero(stockTableView.getInt32(10), 10)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero(stockTableView.getInt16(16), 3)
  data.sortCode = '0000'
  data.data = []
  let CodeNum = 39
  let stockNum = (stockTableView.byteLength - 32) / CodeNum;
  for (let i = 0; i < stockNum; i++) {
    let strArr = [];
    for (let j = 32; j < 44; j++) {
      strArr.push(stockTableView.getUint8(i * CodeNum + j + 10))
    }
    let strArr2 = [];
    for (let j = 0; j < 6; j++) {
      strArr2.push(stockTableView.getUint8(i * CodeNum + 32 + 22 + j))
    }
    let strArr3 = [];
    for (let j = 0; j < 9; j++) {
      strArr3.push(stockTableView.getUint8(i * CodeNum + 32 + 28 + j))
    }
    let strArr4 = [];
    for (let j = 0; j < 2; j++) {
      strArr4.push(stockTableView.getUint8(i * CodeNum + 32 + 37 + j))
    }

    let stockStrCode = []
    for (let j = 0; j < 6; j++) {
      stockStrCode.push(stockTableView.getUint8(i * CodeNum + 32 + 4 + j))
    }

    function generateStock(code, stockCode, stockName, py, market, type) {
      stockCode = addZero(stockCode, 6)
      return {
        stockCode,
        code,
        stockName,
        py,
        market,
        type
      }
    }
    data.data.push(
      generateStock(
        addZero(stockTableView.getInt32(i * CodeNum + 32), 6),
        utf8ByteArrayToString(stockStrCode).replace(/(\u0000*$)/g, ''),
        utf8ByteArrayToString(strArr).replace(/(\u0000*$)/g, ''),
        utf8ByteArrayToString(strArr2).replace(/(\u0000*$)/g, ''),
        utf8ByteArrayToString(strArr3).replace(/(\u0000*$)/g, ''),
        utf8ByteArrayToString(strArr4).replace(/(\u0000*$)/g, ''),
      ))
  }
  return data
}

const toAbnormalTable = function(dataView) {
  let data = {}
  data.type = '103'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = '000000'
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 32
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.stockNo = addZero(dataView.getInt32(i * dataByteLength + 32), 6)
    temp.lastTrade = dataView.getFloat32(i * dataByteLength + 32 + 4).toFixed(2)
    temp.rise = (dataView.getFloat32(i * dataByteLength + 32 + 8) * 100).toFixed(2)
    temp.hand = Math.round(dataView.getFloat32(i * dataByteLength + 32 + 12))
    temp.keyValue = dataView.getFloat32(i * dataByteLength + 32 + 16).toFixed(2)
    let strArr = [];
    for (let j = 20; j < 32; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.updateTime = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}

const toTable104 = function(dataView) {
  let data = {}
  data.type = '104'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 30
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.cno = addZero(dataView.getInt16(i * dataByteLength + 32), 0)
    temp.keyValue = dataView.getFloat32(i * dataByteLength + 32 + 2).toFixed(2)
    let strArr = [];
    for (let j = 6; j < 18; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    strArr = [];
    for (let j = 18; j < 30; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.time = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}

const to106Table = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '106'
  data.timestamp = stockTableView.getInt32(10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.no = stockTableView.getInt16(order)
    order += 2
    let strArr = [];
    for (let i = 0; i < 12; i++) {
      strArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.name = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    let count = stockTableView.getInt16(order)
    order += 2
    obj.children = []
    for (let i = 0; i < count; i++) {
      let childObj = {}
      childObj.cno = stockTableView.getInt16(order)
      order += 2
      let childStrArr = []
      for (let j = 0; j < 12; j++) {
        childStrArr.push(stockTableView.getUint8(order))
        order += 1
      }
      childObj.cname = utf8ByteArrayToString(childStrArr).replace(/\u0000/g, "")
      childStrArr = []
      for (let j = 0; j < 12; j++) {
        childStrArr.push(stockTableView.getUint8(order))
        order += 1
      }
      childObj.keyName = utf8ByteArrayToString(childStrArr).replace(/\u0000/g, "")
      obj.children.push(childObj)
    }
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}
const to101And102Table = (stockTableView) => {
  let data = {
    data: []
  }
  data.timestamp = stockTableView.getInt32(10)
  data.type = stockTableView.getInt16(0) + ''
  data.secondType = stockTableView.getInt16(2)
  data.code = addZero('' + stockTableView.getInt16(2), 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.no = stockTableView.getInt16(order)
    order += 2
    obj.quit = stockTableView.getInt16(order)
    order += 2
    obj.count = stockTableView.getInt16(order)
    order += 2
    obj.decrease = stockTableView.getInt16(order)
    order += 2
    obj.increase = stockTableView.getInt16(order)
    order += 2
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  if (data.type !== 30) {
    data = JSON.parse(JSON.stringify(data).replace('k101', 'k110'))
  }
  return data
}

const toTable120 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '120'
  data.timestamp = stockTableView.getInt32(10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero(stockTableView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    let strArr = []
    for (let j = 0; j < 6; j++) {
      strArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.stockCode = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    obj.zs = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.cjj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.cje = stockTableView.getFloat32(order)
    order += 4
    obj.cjl = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable121 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '121'
  data.timestamp = stockTableView.getInt32(10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = formatDate2(new Date(parseInt(data.timestamp) * 1000))
  data.totalPage = addZero('', 3)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.no = stockTableView.getInt16(order)
    order += 2
    obj.value = stockTableView.getInt16(order)
    order += 2
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable126 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '126'
  data.timestamp = stockTableView.getInt32(10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    let childStrArr = []
    for (let j = 0; j < 6; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.stockCode = utf8ByteArrayToString(childStrArr)
    childStrArr = []
    for (let j = 0; j < 5; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.time = utf8ByteArrayToString(childStrArr)
    obj.value = stockTableView.getInt16(order)
    order += 2
    obj.no = stockTableView.getInt16(order)
    order += 2
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}
const toTable129 = (dataView) => {
  let data = {}
  data.type = '129'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    for (let j = 0; j < 7; j++) {
      let key = dataView.getInt16(i * dataByteLength + 32 + j * 4)
      temp[key] = dataView.getInt16(i * dataByteLength + 32 + 2 + j * 4)
    }
    let strArr = [];
    for (let j = 28; j < 38; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.t = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}
const toTable127 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '127'
  data.list = stockTableView.getInt32(10)
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero(stockTableView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    let childStrArr = []
    for (let j = 0; j < 6; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.stockCode = utf8ByteArrayToString(childStrArr)
    childStrArr = []
    for (let j = 0; j < 5; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.time = utf8ByteArrayToString(childStrArr)
    obj.value = stockTableView.getInt16(order)
    order += 2
    obj.no = stockTableView.getInt16(order)
    order += 2
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}
const toTable128 = (dataView) => {
  let data = {}
  data.type = '128'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    for (let j = 0; j < 7; j++) {
      let key = dataView.getInt16(i * dataByteLength + 32 + j * 4)
      temp[key] = dataView.getInt16(i * dataByteLength + 32 + 2 + j * 4)
    }
    let strArr = [];
    for (let j = 28; j < 38; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.t = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)

  }
  return data
}

const toTable131 = (dataView) => {
  let data = {}
  data.type = '131'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    for (let j = 0; j < 7; j++) {
      let key = dataView.getInt16(i * dataByteLength + 32 + j * 4)
      temp[key] = dataView.getInt16(i * dataByteLength + 32 + 2 + j * 4)
    }
    let strArr = [];
    for (let j = 28; j < 38; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.t = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)

  }

  return data
}

const toTable132 = (dataView) => {
  let data = {}
  data.type = '132'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 38
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    for (let j = 0; j < 7; j++) {
      let key = dataView.getInt16(i * dataByteLength + 32 + j * 4)
      temp[key] = dataView.getInt16(i * dataByteLength + 32 + 2 + j * 4)
    }
    let strArr = [];
    for (let j = 28; j < 38; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.t = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)

  }

  return data
}

const toTable123 = (dataView) => {
  const data = {}
  data.type = '123'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 34
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 34).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 34 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 34 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 34 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 34 + 20).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 34 + 16).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(32 + i * 34 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }

  return data
}

const toTable124 = (dataView) => {
  const data = {}
  data.type = '124'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 34
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}

    temp.price = dataView.getFloat32(32 + i * 34).toFixed(2)
    temp.open = dataView.getFloat32(32 + i * 34 + 4).toFixed(2)
    temp.high = dataView.getFloat32(32 + i * 34 + 8).toFixed(2)
    temp.low = dataView.getFloat32(32 + i * 34 + 12).toFixed(2)
    temp.value = dataView.getFloat32(32 + i * 34 + 20).toFixed(2)
    temp.volume = dataView.getFloat32(32 + i * 34 + 16).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(32 + i * 34 + 24 + j))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}

const toTable125 = (dataView) => {
  const data = {}
  data.type = '125'
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 6)
  data.date = addZero('', 8)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  data.data = []
  let dataByteLength = 14
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    temp.rf = dataView.getFloat32(i * dataByteLength + 32).toFixed(2)
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32 + 4))
    }
    temp.date = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    data.data.push(temp)
  }
  return data
}

const toTable134 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '134'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    let childStrArr = []
    for (let j = 0; j < 6; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.stockCode = utf8ByteArrayToString(childStrArr)
    obj.price = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zsj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.volume = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.hgtBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.hgtSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable136 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '136'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.id = stockTableView.getInt32(order)
    order += 4
    obj.buy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.sell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.hgt = stockTableView.getInt16(order)
    order += 2
    obj.all = stockTableView.getInt16(order)
    order += 2
    obj.jg = stockTableView.getInt16(order)
    order += 2
    obj.year = stockTableView.getInt16(order)
    order += 2
    obj.month = stockTableView.getInt16(order)
    order += 2
    obj.yyb = stockTableView.getInt16(order)
    order += 2
    obj.hyd = stockTableView.getInt16(order)
    order += 2
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable137 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '137'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    let childStrArr = []
    for (let j = 0; j < 6; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.stockCode = utf8ByteArrayToString(childStrArr)
    obj.buy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.sell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.zsj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.cjj = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.volume = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable133 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '133'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero(stockTableView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.hgtBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.hgtSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.qbBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.qbSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.jgBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.jgSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.yearyybBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.yearyybSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.monthyybBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.monthyybSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.allyybBuy = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    obj.allyybSell = parseFloat(stockTableView.getFloat32(order).toFixed(2))
    order += 4
    let childStrArr = []
    for (let j = 0; j < 10; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.t = utf8ByteArrayToString(childStrArr)
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }

  return data
}

const toTable138 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '138'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.hgtBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.hgtSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.volume = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    let childStrArr = []
    for (let j = 0; j < 10; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.date = utf8ByteArrayToString(childStrArr)
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable140 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '140'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.id = stockTableView.getInt32(order)
    order += 4
    let childStrArr = []
    for (let j = 0; j < 120; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.name = utf8ByteArrayToString(childStrArr)
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const toTable141 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '141'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero(stockTableView.getInt16(16), 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.isOnList = stockTableView.getInt16(order)
    order += 2
    obj.hgtBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.hgtSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.qbSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.jgSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.yearyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.monthyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybBuy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.allyybSell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.volume = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    let childStrArr = []
    for (let j = 0; j < 10; j++) {
      childStrArr.push(stockTableView.getUint8(order))
      order += 1
    }
    obj.t = utf8ByteArrayToString(childStrArr)
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }

  return data
}

const toTable142 = function(dataView) {
  let data = {}
  data.type = '142'
  // debugger
  data.code = addZero(dataView.getInt16(2), 3) + addZero(dataView.getInt16(4), 3)
  data.stockCode = addZero(dataView.getInt32(6), 6)
  data.timestamp = addZero(dataView.getInt32(10), 10)
  data.date = addZero('', 8)
  data.totalPage = addZero(dataView.getInt16(14), 3)
  data.page = addZero(dataView.getInt16(16), 3)
  data.sortCode = addZero('' + dataView.getInt16(18) + dataView.getInt16(20), 4)
  data.data = []
  let dataByteLength
  dataByteLength = 60
  let itemLength = Math.round((dataView.byteLength - 32) / dataByteLength)
  for (let i = 0; i < itemLength; i++) {
    let temp = {}
    let strArr = []
    for (let j = 0; j < 10; j++) {
      strArr.push(dataView.getUint8(i * dataByteLength + j + 32))
    }
    temp.t = utf8ByteArrayToString(strArr).replace(/\u0000/g, "")
    // temp.cno = addZero(dataView.getInt16(i * dataByteLength + 32), 0)
    temp.flag = dataView.getInt16(10 + i * dataByteLength + 32)

    let propertyArr = ['cqfz','gjj','jlr','jyxjl',
                       'kzrcg','ldfz','ltag','wfplr',
                       'yyzsr','zfz','zgb','zzc']
    
    for(let k = 0; k < propertyArr.length; k++) {
      let index = 4 * k  + i * dataByteLength + 44
      temp[propertyArr[k]] = dataView.getFloat32(index)
    }
    temp.mggjj = (temp.gjj / temp.zgb).toFixed(2)
    temp.mgxjl = (temp.jyxjl / temp.zgb).toFixed(2)
    temp.mgjlr = (temp.jlr / temp.zgb).toFixed(2)
    temp.mgwfp = (temp.wfplr / temp.zgb).toFixed(2)
    data.data.push(temp)
  }
  
  return data
}

const toTable139 = (stockTableView) => {
  let data = {
    data: []
  }
  data.type = '139'
  data.timestamp = addZero('', 10)
  data.code = addZero('', 3) + addZero('', 3)
  data.stockCode = addZero('', 6)
  data.date = addZero('', 8)
  data.totalPage = stockTableView.getInt16(14)
  data.page = addZero('', 3)
  data.sortCode = addZero('', 4)
  let order = 32
  while (true) {
    let obj = {}
    obj.id = stockTableView.getInt32(order)
    order += 4
    obj.buy = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.sell = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    obj.volume = stockTableView.getFloat32(order).toFixed(2)
    order += 4
    data.data.push(obj)
    if (order >= stockTableView.byteLength) break;
  }
  return data
}

const analysisByte = function(buffer) {
  const dataView = new DataView(buffer)
  const type = dataView.getInt16(0)
  switch (type) {
    case 105:
      return toStockTable(dataView)
      break
    case 106:
      return to106Table(dataView)
      break
    case 101:
      return to101And102Table(dataView)
      break
    case 102:
      return to101And102Table(dataView)
      break
    case 103:
      return toAbnormalTable(dataView)
      break
    case 104:
      return toTable104(dataView)
      break
    case 107:
      return toTable107(dataView)
      break
    case 108:
      return toTable108(dataView)
      break
    case 109:
      return toTable109(dataView)
      break
    case 110:
      return toTable110(dataView)
      break
    case 122:
      return toTable122(dataView)
      break
    case 112:
      return toTable112(dataView)
      break
    case 113:
      return toTable113(dataView)
      break
    case 114:
      return toTable114(dataView)
      break
    case 115:
      return toTable115(dataView)
      break
    case 116:
      return toTable116(dataView)
      break
    case 117:
      return toTable117(dataView)
      break
    case 118:
      return toTable118(dataView)
      break
    case 119:
      return toTable119(dataView)
      break
    case 120:
      return toTable120(dataView)
      break
    case 121:
      return toTable121(dataView)
      break
    case 123:
      return toTable123(dataView)
      break
    case 124:
      return toTable124(dataView)
      break
    case 125:
      return toTable125(dataView)
      break
    case 126:
      return toTable126(dataView)
      break
    case 127:
      return toTable127(dataView)
      break
    case 128:
      return toTable128(dataView)
      break
    case 129:
      return toTable129(dataView)
      break
    case 131:
      return toTable131(dataView)
      break
    case 132:
      return toTable132(dataView)
      break
    case 133:
      return toTable133(dataView)
      break
    case 134:
      return toTable134(dataView)
      break
    case 136:
      return toTable136(dataView)
      break
    case 137:
      return toTable137(dataView)
      break
    case 138:
      return toTable138(dataView)
      break
    case 139:
      return toTable139(dataView)
      break
    case 140:
      return toTable140(dataView)
      break
    case 141:
      return toTable141(dataView)
      break
    case 142:
      return toTable142(dataView)  
      break
  }
}

export default analysisByte