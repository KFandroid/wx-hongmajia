export const file105 = {
    type: '105',
    changeCb: (data) => {
      app.globalData.a105 = data
      app.globalData.stockList = data.data
      let key = addZeroAfter('a105', 31)
      wx.setStorage({ key, data })
    },
    createKey: () => {
      let val = this.createKeyStr(105, '000000', '000000', true)
      return val
    }
  }

  export const file106 = {
    type: '106',
    changeCb: (data) => {
      let itemArr = []
      let a106 = data.data
      for (let i = 0; i < a106.length; i++) {
        let cno = a106[i].no
        let temp = {}
        if (a106[i].hasOwnProperty('children')) {
          let children = a106[i].children
          for (let j = 0; j < children.length; j++) {
            temp = Object.assign({}, children[j])
            temp.cno = '' + cno + children[j].cno
            temp.name = a106[i].name
            temp.code = addZero(cno, 3) + addZero(children[j].cno, 3)
            temp.totalName = '' + temp.name + '-' + temp.cname
            itemArr.push(temp)
          }
        }
      }
      let key = addZeroAfter('a106', 31)
      wx.setStorage({ key, data })
      this.setData({
        t106: data,
        itemList: itemArr
      })

    },
    createKey: () => {
      let val = this.createKeyStr2(106, '000000', '000000', true)
      return val
    }
  }

  export const file109 = {
    type: '109',
    changeCb: (data) => {
      let key = addZeroAfter('a109', 31)
      let newTradeDate = data.data[data.data.length - 1]
      this.setData({
        date: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2),
        date2: newTradeDate.year + '-' + addZero(newTradeDate.month, 2) + '-' + addZero(newTradeDate.day, 2)
      })
      wx.setStorage({ key, data })
    },
    createKey: () => {
      let val = this.createKeyStr2(109, '000000', '000000', true, null, '00000000')
      return val
    }
    // isCallMainBack: false
  }