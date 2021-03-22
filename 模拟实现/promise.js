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
        rejct(e)
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
