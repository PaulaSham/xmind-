function Promise(fn) {
  let state = 'pending'
  let value = ''
  let callbacks = [] //todo 作用

  // on 处理的意思 同handle
  this.then = function (onFulFilled, onRejected) {
    // 为什么要 return
    return new Promise((resolve, reject) => {
      handle({ onFulFilled, onRejected, resolve, reject })
    })
  }

  this.all = function (arr) {
    // 初始化，复制一遍
    const args = Array.prototype.slice.call(arr)
    return new Promise((res, rej) => {
      const len = args.length
      console.log('len', len)
      let remaining = len
      if (len === 0) return res([])
      function ret(index, value) {
        try {
          if (
            value &&
            (typeof value === 'object' || typeof value === 'function')
          ) {
            const { then } = value
            // 非常巧妙
            if (typeof then === 'function') {
              then.call(
                value,
                (val) => {
                  ret(index, val)
                },
                rej,
              )
            }
          }
          args[index] = value
          if (--remaining === 0) {
            res(args)
          }
        } catch (e) {
          rej(e)
        }
      }

      for (let i = 0; i < len; i++) {
        ret(i, args[i])
      }
    })
  }

  this.race = function (arr) {
    const len = arr.length
    return new Promise(function (res, rej) {
      for (let i = 0; i < len; i++) {
        arr[i].then(res, rej)
      }
    })
  }

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback)
      return
    }
    const cb =
      state === 'fulfilled' ? callback.onFulFilled : callback.onRejected
    const next = state === 'fulfilled' ? callback.resolve : callback.reject
    if (!cb) {
      next(value)
      return
    }
    let ret = null
    try {
      // todo why cb
      ret = cb(value) //then的执行结果存储再ret里
    } catch (e) {
      callback.reject(e) // 只有错误才reject，其他都resolve
    }
    // todo why resolve
    callback.resolve(ret) //此时已排除错误的情况
  }

  function resolve(newVal) {
    const fn = () => {
      // 状态一旦改变，就不能再变化
      if (state !== 'pending') {
        return
      }
      state = 'fulfilled'
      value = newVal
      handleCb()
    }
    setTimeout(fn, 0)
  }

  function handleCb() {
    const len = callbacks.length
    if (len === 0) {
      return
    }
    const callback = callbacks.shift()
    handle(callback)
  }

  function reject(newVal) {
    const fn = () => {
      if (state !== 'pending') {
        return
      }
      state = 'rejected'
      value = newVal
      handleCb()
    }
    setTimeout(fn, 0)
  }

  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 0)
})
const p2 = new Promise((resolve, reject) => resolve('p2'))

// 测试resolve，reject
// p1.then(
//   (res) => console.log("res", res),
//   (rej) => console.log("rej", rej)
// );

// 测试all
// new Promise().all([p1, p2]).then((res) => console.log("all", res));

// 测试race
new Promise().race([p1, p2]).then((res) => console.log('race', res))
