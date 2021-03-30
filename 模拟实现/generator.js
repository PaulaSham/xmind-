// generator自动执行
function* gen() {
  let url1 = 'https://api.github.com/users/github'
  let url2 = 'https://api.github.com/users/github/followers'
  var result = yield fetch(url1)
  var result1 = yield fetch(url2)
  console.log('fsfsf', result)
  console.log('result', result1)
}

function run(gen) {
  console.log('run')
  let g = gen()
  return new Promise((res, rej) => {
    function next(data) {
      try {
        var result = g.next(data)
      } catch (e) {
        rej(e)
      }
      if (result.done) return res(result.value)
      const value = toPromise(result.value)
      value.then(
        (data) => {
          next(data)
        },
        (err) => rej(err),
      )
      // const value = result.value;
      // // 是个promise
      // if (isPromise(value)) {
      //   value.then((data) => {
      //     next(data);
      //   });
      // } else {
      //   // 是个回调函数
      //   value(next);
      // }
    }
    next()
  })
}

run(gen)

function isPromise(obj) {
  return typeof obj.then === 'function'
}

function toPromise(obj) {
  if (isPromise(obj)) return obj
  if (typeof obj === 'function') return thunkToPromise(obj)
  return obj
}

function thunkToPromise(fn) {
  return new Promise((res, rej) => {
    fn((err, data) => {
      if (err) return rej(err)
      res(data)
    })
  })
}
