// bind

Function.prototype.bind2 = function (context) {
  if (typeof this !== 'function') {
    throw Error('must be function')
  }
  var self = this
  var args = Array.prototype.slice.call(arguments, 1)
  var FNop = function () {}
  var FBound = function () {
    var bindArgs = Array.prototype.slice.call(arguments)
    return self.apply(
      this instanceof FBound ? this : context,
      args.concat(bindArgs),
    )
  }
  FNop.prototype = self.prototype
  FBound.prototype = new FNop()
  return FBound
}

// call

Function.prototype.call2 = function (context) {
  context.fn = this || window

  var args = []

  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }

  const res = eval('context.fn(' + args + ')')

  delete context.fn

  return res
}

//   严谨版：
/**
  
           * @description: 实现call方法
  
           * @param : context this要绑定的值
  
           * @param : args 除第一个参数外的参数集合
  
           * @return: 函数返回值
  
           */

Function.prototype.myCall = function (context, ...args) {
  let handler = Symbol() // 生成一个唯一的值，用来作为要绑定对象的属性key，储存当前调用call方法的函数

  // 如果第一个参数为引用类型或者null

  if (typeof context === 'object') {
    // 如果为null 则this为window

    context = context || window
  } else {
    // 如果为undefined 则this绑定为window

    if (typeof context === 'undefined') {
      context = window
    } else {
      // 基本类型包装  1 => Number{1}

      context = Object(context)
    }
  }

  // this 为当前调用call方法的函数。

  context.handler = this

  // 执行这个函数。这时这个函数内部this绑定为cxt，储存函数执行后的返回值。

  let result = context.handler(...args)

  // 删除对象上的函数

  delete context.handler

  // 返回结果

  return result
}

// apply

Function.prototype.apply2 = function (context, arr) {
  context.fn = this || window

  var res

  if (!arr) {
    res = context.fn()
  } else {
    var args = []

    for (let i = 0; i < arr.length; i++) {
      args.push('arr[' + i + ']')
    }

    res = eval('context.fn(' + args + ')')
  }

  delete context.fn

  return res
}

// new

function objectFactory3() {
  var obj = new Object()

  var Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype

  var ret = Constructor.apply(obj, arguments)

  return typeof ret === 'object' ? ret : obj
}
