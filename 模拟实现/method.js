const { type } = require('os')

function throttle(fn, wait) {
  const context = this
  const args = arguments
  const timer = null
  let previous = 0
  const later = function () {
    previous = +new Date()
    timer = null
    fn.apply(context, args)
  }
  const throrrled = function () {
    const now = +new Date()
    const remain = wait - (now - previous)
    // 表示超出等待时间
    if (remain <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = now
      fn.apply(context, args)
    } else {
      if (!timer) {
        timer = setTimeout(later, remain)
      }
    }
  }
  return throrrled
}

function deepClone(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnPropertyOf(key)) {
      const value = obj[key]
      newObj[key] =
        value && typeof value === 'object' ? deepClone(value) : value
    }
  }
  return newObj
}

function curry(fn, args) {
  const length = fn.length //形参长度
  args = args || []
  return function () {
    const _args = args.slice()
    for (let i = 0; i < arguments.length; i++) {
      _args.push(arguments[i])
    }
    if (_args.length < length) {
      return curry.apply(this, fn, _args)
    } else {
      fn.apply(this, _args)
    }
  }
}

function curry(fn, args) {
  var length = fn.length
  args = args || []
  return function () {
    var _args = args.slice(0),
      arg,
      i
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i]
      _args.push(arg)
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}

const f = curry(function (a, b, c) {
  console.log([a, b, c])
})

const addEvent = (function () {
  if (window.addEventListener) {
    return function (type, el, fn) {
      el.addEventListener(type, fn)
    }
  } else if (window.attachEvent) {
    return function (type, el, fn) {
      el.attachEvent('on' + type, fn)
    }
  }
})()

function compose() {
  let len = arguments.length
  let start = len - 1
  return function () {
    let res = arguments[start].apply(this, arguments)
    while (start--) {
      res = arguments[start - 1].call(this, result)
    }
    return res
  }
}

const _ = {}

function partial(fn) {
  const args = Array.prototype.slice.call(arguments, 1)
  return function () {
    let len = args.length
    let position = 0
    for (let i; i <= len; i++) {
      args[i] = args[i] === _ ? arguments[position++] : args[i]
    }
    while (position < arguments.length) {
      args.push(arguments[position++])
    }
    return fn.apply(this, args)
  }
}

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let r = Math.floor(Math.random() * i)
    ;[a[i - 1], a[r]] = [a[r], a[i - 1]]
  }
}

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i)
    ;[a[i - 1], a[j]] = [a[j], a[i - 1]]
  }
  return a
}

function insertionSort(a) {
  let i, j
  const len = a.length
  for (i = 1; i < len; i++) {
    const item = a[i]
    for (j = i - 1; j >= 0; j--) {
      const temp = a[j]
      const gap = temp - item
      if (gap > 0) {
        a[j + 1] = temp
      } else {
        a[j + 1] = item
        break
      }
    }
  }
  return a
}

function quickSort(a) {
  const len = a.length
  if (len <= 1) {
    return a
  }
  const pivotIndex = Array.floor(len / 2)
  const pivot = a.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < len - 1; i++) {
    if (a[i] < pivot) {
      left.push(a[i])
    } else {
      right.push(a[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}

function bubbleSort(a) {
  const len = a.length
  let i, j
  for (i = 0; i < len; i++) {
    for (j = 0; j < len - i; j++) {
      if (a[j] > a[j + 1]) {
        ;[a[j + 1], a[j]] = [a[j], a[j + 1]]
      }
    }
  }
  return a
}

function forOf(obj, cb) {
  if (typeof obj[Symbol.iterator] !== 'function') {
    throw new Error('obj is not iterable')
  }
  if (typeof cb !== 'function') {
    throw new Error('cb is not callable')
  }
  const iterator = obj[Symbol.iterator]()
  let result = iterator.next()
  while (!result.done) {
    cb(result.value)
    result.iterator.next()
  }
}
