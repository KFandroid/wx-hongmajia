const unitArr = ['千', '万', '千万', '亿', '千亿']

function getNumUnit(num) {
  let strNum = String(num)
  if(unitArr.indexOf(strNum[strNum.length - 1]) > -1) {
    return num
  }
  let intNum = Math.round(num)

  let numStringLength = String(intNum).length
  let unit = ''
  let bit = 0
  
  switch (true) {
    case (numStringLength <= 4 ):
      return num
      break
    // case (numStringLength === 4):
    //   unit = '千'
    //   bit = 3
    //   break
    case (numStringLength <= 7 && numStringLength >= 5):
      unit = '万'
      bit = 4
      break
    case (numStringLength <= 8):
      unit = '千万'
      bit = 7
      break
    case (numStringLength <= 11):
      unit = '亿'
      bit = 8
      break
    case (numStringLength > 11):
      unit = '千亿'
      bit = 9
      break
  }
  unit = '' + (intNum / Math.pow(10, bit)).toFixed(1) + unit
  return unit
}

module.exports = {
  getNumUnit
}
