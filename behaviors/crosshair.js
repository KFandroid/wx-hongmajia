module.exports = Behavior({
  behaviors: [],
  properties: {
    height: {
      type: Number,
      value: 300,
      observer(newData) {
        this.setData({
          yRange: [0, newData]
        })
        if (Object.keys(this.data.data).length !== 0) {
          this.preprocess()


        }
        this.draw()
      }
    },
    width: {
      type: Number,
      value: 200,
      observer(newData) {

        this.setData({
          xRange: [0, newData]
        })
        if (Object.keys(this.data.data).length !== 0) {
          this.preprocess()
        }
        this.draw()
      }
    },
  },
  data: {
    showCrosshair: false,
    data: {},
    xRange: [0, 300],
    yRange: [0, 200],
    yDomain: [],
    start: [9, 30],
    timeIndex: 241,
  },
  attached() { },
  methods: {
    myBehaviorMethod() { }
  }
})