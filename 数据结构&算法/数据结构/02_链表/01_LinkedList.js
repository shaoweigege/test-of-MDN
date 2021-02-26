function Node(element) {
  this.element = element
  this.next = null
}

function LinkedList() {
  this.head = new Node('HEAD')
}

LinkedList.prototype.find = function (element) {
  let currNode = this.head
  while (currNode.element !== element) {
    currNode = currNode.next
  }
  return currNode
}

LinkedList.prototype.findPrevious = function (element) {
  let targetNode = this.head
  let currNode = this.head
  while (currNode.element !== element) {
    targetNode = currNode
    currNode = currNode.next
  }
  return targetNode
}

LinkedList.prototype.insert = function (newElement, element) {
  let currNode = this.find(element)
  let newNode = new Node(element)
  newNode.next = currNode.next
  currNode.next = newNode
}

LinkedList.prototype.remove = function (element) {
  let prevNode = this.findPrevious(element)
  prevNode.next = prevNode.next.next
}

LinkedList.prototype.display = function () {
  let currNode = this.head
  while (currNode.next !== null) {
    console.log(currNode.element)
    currNode = currNode.next
  }
}
