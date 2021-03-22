function Promise(fn) {
  let state = 'pending'
  let value = ''
  let callbacks = []
  this.then = function (onFulfilled, onRejected) {
    return new Promise((res, rej) => {
      handle({
        onFulfilled,
        onRejected,
        res,
        rej,
      })
    })
  }
  this.catch = function (onErr) {
    this.then(null, onErr)
  }
  this.finally = function (onDone) {
    this.then(onDone, onDone)
  }

  /**
   * 
   * @param 
   * 这些情况下，Promise.resolve 的入参可能有以下几种情况：
      无参数 [直接返回一个resolved状态的 Promise 对象]
      普通数据对象 [直接返回一个resolved状态的 Promise 对象]
      一个Promise实例 [直接返回当前实例]
      一个thenable对象(thenable对象指的是具有then方法的对象) [转为 Promise 对象，并立即执行thenable对象的then方法。]
   * @returns 
   */
  this.resolve = function (value) {
    if (value && value instanceof Promise) {
      return value
    } else if (
      value &&
      typeof value === 'object' &&
      typeof value.then === 'function'
    ) {
      const { then } = value
      return new Promise((resolve) => {
        then(resolve)
      })
    } else if (value) {
      return new Promise((resolve) => resolve(value))
    } else {
      return new Promise((resolve) => resolve())
    }
  }

  this.reject = function (value) {
    return new Promise((resolve, reject) => reject(value))
  }

  this.all = function (arr) {
    const args = Array.prototype.slice.call(arr)
    return new Promise((resolve, reject) => {
      const len = args.length
      if (len === 0) {
        return resolve([])
      }
      let remaining = len
      function res(index, val) {
        try {
          if (
            val &&
            typeof val === 'object' &&
            typeof val.then === 'function'
          ) {
            const { then } = val
            then.call(
              val,
              (val) => {
                res(index, val)
              },
              reject,
            )
          }
          args[i] = val
          if (--remaining === 0) {
            resolve(args)
          }
        } catch (e) {
          reject(e)
        }
      }
      for (let i = 0; i < len; i++) {
        res(i, args[i])
      }
    })
  }

  this.race = function (arr) {
    return new Promise((resolve, reject) => {
      const len = arr.length
      for (let i = 0; i < len; i++) {
        arr[i].then(resolve, reject)
      }
    })
  }

  function handle(cb) {
    if (state === 'pending') {
      callbacks.push(cb)
      return
    }
    const callback = this.state === 'fulfilled' ? cb.onFulfilled : cb.onRejected
    const next = this.state === 'fulfilled' ? resolve : reject
    if (state === 'fulfilled') {
      if (!callback) {
        const ret = value
        next(ret)
      }
      try {
        const ret = callback(value)
        next(ret)
      } catch (e) {
        reject(e)
      }
    }
  }

  function resolve(val) {
    const fn = () => {
      if (state !== 'pending') {
        return
      }
      // 如果val是Promise，主动为其注入回调函数
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        const { then } = val
        if (typeof then === 'function') {
          then.call(val, resolve)
          return
        }
      }
      state = 'fulfilled'
      value = val
      handleCb()
    }
    //?
    setTimeout(fn, 0)
  }

  function reject(err) {
    const fn = () => {
      if (state !== 'pending') {
        return
      }
      if (err && (typeof err === 'object' || typeof err === 'function')) {
        const { then } = err
        then.call(err, reject)
        return
      }
      state = 'rejected'
      value = err
      handleCb()
    }
    setTimeout(fn, 0)
  }

  function handleCb() {
    if (callbacks.length) {
      const cb = callbacks.shift()
      handle(cb)
    }
  }
  fn(resolve, reject)
}
