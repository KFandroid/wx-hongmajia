export const transfer2 = function(k102, k104, cno) {
  tree = k102.filter((item) => item.cno === cno)[0].datas
  for (let i = 0, length = tree.length; i < length; i++) {
    let stockNo = tree[i].stockNo
    tree[i].rose = computeRose(tree[i].prevClose, tree[i].lastTrade)
    for (let index = 0, length2 = k104.length; index < length2; index++) {
      if (k104[index].symbol === stockNo) {
        tree[i] = Object.assign({}, tree[i], k104[index])
      }
    }
  }
}