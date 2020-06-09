let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
const binary_search = function (array, target) {
  let startIndex = 0
  let endIndex = array.length - 1

  while (true) {
    let mid = Math.floor((startIndex + endIndex) / 2)
    if (endIndex >= startIndex) {
      if (array[mid] === target) {
        return mid
      } else if (array[mid] > target) {
        endIndex = mid
        console.log('目标在左边')
      } else if (array[mid] < target) {
        startIndex = mid
        console.log('目标在右边')
      }
    } else {
      return null
    }
  }
}


console.log(binary_search(arr, 'Y'))
