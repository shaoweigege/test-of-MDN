let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
const binary_search = function (array, target) {
  let startIndex = 0
  let endIndex = array.length - 1

  while (true) {
    let mid = Math.floor((startIndex + endIndex) / 2)
    console.log(mid, startIndex, endIndex)
    if (endIndex >= startIndex) {
      if (array[mid] === target) {
        return mid
      } else if (array[mid] > target) {
        endIndex = mid
      } else if (array[mid] < target) {
        startIndex = mid
      }
    } else {
      return null
    }
  }
}


console.log(binary_search(arr, 'Y'))
