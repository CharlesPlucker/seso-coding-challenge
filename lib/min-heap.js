"use strict";

module.exports = class MinHeap {

  #heap;
  #valueKey;

  constructor(valueKey = 'value') {
    this.#heap = [];
    this.#valueKey = valueKey;
  }

  #hasLeftChild(parentIndex) {
    return this.#getLeftChildIndex(parentIndex) < this.#heap.length;
  }

  #hasRightChild(parentIndex) {
    return this.#getRightChildIndex(parentIndex) < this.#heap.length;
  }

  #getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  #getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  #getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  #getItemValue(index) {
    return this.#heap[index][this.#valueKey];
  }

  #swap(index1, index2) {
    const temp = this.#heap[index1];
    this.#heap[index1] = this.#heap[index2];
    this.#heap[index2] = temp;
  }

  #heapifyUp() {
    let index = this.#heap.length - 1;
    let parentIndex = this.#getParentIndex(index);
    while (parentIndex >= 0 &&
           this.#getItemValue(parentIndex) > this.#getItemValue(index)) {
      this.#swap(parentIndex, index);
      index = parentIndex;
      parentIndex = this.#getParentIndex(index);
    }
  }

  #heapifyDown() {
    let index = 0;
    while (this.#hasLeftChild(index)) {
      let smallerChildIndex = this.#getLeftChildIndex(index);
      if (this.#hasRightChild(index) && 
          this.#getItemValue(this.#getRightChildIndex(index)) < this.#getItemValue(this.#getLeftChildIndex(index))) {
            smallerChildIndex = this.#getRightChildIndex(index);
      }
      if (this.#getItemValue(index) < this.#getItemValue(smallerChildIndex)) {
        break;
      }
      else {
        this.#swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  peek() {
    if (this.#heap.length === 0) return false;
    return this.#heap[0];
  }

  add(item) {
    if (!item[this.#valueKey]) {
      throw new Error('Error: MinHeap only supports objects with a comparator key.')
    }
    this.#heap.push(item);
    this.#heapifyUp();
  }

  remove() {
    const minItem = this.#heap[0];
    if (minItem === undefined) return false;
    this.#heap[0] = this.#heap[this.#heap.length - 1];
    this.#heap.pop();
    this.#heapifyDown();
    return minItem;
  }
}
