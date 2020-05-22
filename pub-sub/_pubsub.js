//root factory是形参
(function (root, factory) {
  'use strict'; //使用严格模式

  var PubSub = {}; //声明一个空对象容器
  //root就可以看成是window对象  给window对象添加PubSub属性 对应的值就是上面声明的空对象
  root.PubSub = PubSub;

  var define = root.define;

  factory(PubSub);  //执行一次传入的第二个参数(一个函数)

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return PubSub;
    });

    // CommonJS and Node.js module support
  } else if (typeof exports === 'object') {
    if (module !== undefined && module.exports) {
      exports = module.exports = PubSub; // Node.js specific `module.exports`
    }
    exports.PubSub = PubSub; // CommonJS module 1.1.1 spec
    module.exports = exports = PubSub; // CommonJS
  }

}((typeof window === 'object' && window) || this, function (PubSub) {
  'use strict';
  //所有的功能都是function(factory){}这个函数提供的
  var messages = {}, lastUid = -1;

  // 判断对象上的属性是否都是通过集成而拥有的功能函数
  // 如果有一个对象本身的属性(并非所有属性都是在对象的原型上的情况)则返回true
  // 如果该对象的属性全是从原型上集成而来的 那么该函数返回的是false
  function hasKeys(obj) {
    var key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns a function that throws the passed exception, for use as argument for setTimeout
   * @alias throwException
   * @function
   * @param { Object } ex An Error object
   */
  // 返回值是一个函数 该函数内部跑出一个错误对象
  // 因为返回一个函数的话 那么该函数可以直接作为setTimeout()函数的第一个参数
  function throwException(ex) {
    return function reThrowException() {
      throw ex;
    };
  }

  /**
   * 一个功能函数
   * @alias callSubscriberWithDelayedExceptions
   * @function
   * @param1 subscriber:function 函数类型的参数 接受后面两个参数 message:string data:obj
   */
  function callSubscriberWithDelayedExceptions(subscriber, message, data) {
    try {
      subscriber(message, data);
    } catch (ex) {
      // 如果程序执行遇到异常 直接抛出异常
      setTimeout(throwException(ex), 0);
    }
  }

  function callSubscriberWithImmediateExceptions(subscriber, message, data) {
    subscriber(message, data);
  }

  function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
    var subscribers = messages[matchedMessage];
    var callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions;
    var s; // s就是一个变量 用来表示subscribers对象中的所有的属性名

    // 如果messages的本身并不包含matchedMessage属性 不做处理
    // 只有当messages的本身包含matchedMessage属性时才去做处理
    if (!messages.hasOwnProperty(matchedMessage)) return;

    // 此处说明messages的本身是包含matchedMessage属性的
    for (s in subscribers) {
      // 排除非subscribers本身的属性
      if (subscribers.hasOwnProperty(s)) {
        // 下面的语句最终都会执行 ==> subscribe[s](originalMessage,data)
        callSubscriber(subscribers[s], originalMessage, data);
      }
    }
  }

  function createDeliveryFunction(message, data, immediateExceptions) {
    // 该函数的返回值是一个函数
    return function deliverNamespaced() {
      var topic = String(message);
      var position = topic.lastIndexOf('.');
      // deliver the message as it is now
      deliverMessage(message, message, data, immediateExceptions);
      // trim the hierarchy and deliver message to each level
      while (position !== -1) {
        topic = topic.substr(0, position);
        position = topic.lastIndexOf('.');
        deliverMessage(message, topic, data, immediateExceptions);
      }
    };
  }

  function messageHasSubscribers(message) {
    var topic = String(message);
    var found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
    var position = topic.lastIndexOf('.');

    while (!found && position !== -1) {
      topic = topic.substr(0, position);
      position = topic.lastIndexOf('.');
      found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
    }
    return found;
  }

  function publish(message, data, sync, immediateExceptions) {
    // 确保message是字符串类型的值
    message = (typeof message === 'symbol') ? message.toString() : message;
    var deliver = createDeliveryFunction(message, data, immediateExceptions);
    var hasSubscribers = messageHasSubscribers(message);

    if (!hasSubscribers) return false;

    sync === true ? deliver() : setTimeout(deliver, 0);

    return true;
  }

  /**
   * Publishes the message, passing the data to it's subscribers
   * @function
   * @alias publish
   * @param { String } message The message to publish
   * @param {} data The data to pass to subscribers
   * @return { Boolean }
   */
  PubSub.publish = function (message, data) {
    return publish(message, data, false, PubSub.immediateExceptions);
  };

  /**
   * Publishes the the message synchronously, passing the data to it's subscribers
   * @function
   * @alias publishSync
   * @param { String } message The message to publish
   * @param {} data The data to pass to subscribers
   * @return { Boolean }
   */
  PubSub.publishSync = function (message, data) {
    return publish(message, data, true, PubSub.immediateExceptions);
  };

  /**
   * Subscribes the passed function to the passed message.
   * Every returned token is unique and should be stored if you need to unsubscribe
   * @function
   * @alias subscribe
   * @param { String } message The message to subscribe to
   * @param { Function } func The function to call when a new message is published
   * @return { String }
   */
  PubSub.subscribe = function (message, func) {
    if (typeof func !== 'function') {
      return false;
    }

    message = (typeof message === 'symbol') ? message.toString() : message;

    // message is not registered yet
    if (!messages.hasOwnProperty(message)) {
      messages[message] = {};
    }

    // forcing token as String, to allow for future expansions without breaking usage
    // and allow for easy use as key names for the 'messages' object
    var token = 'uid_' + String(++lastUid);
    messages[message][token] = func;

    // return token for unsubscribing
    return token;
  };

  /**
   * Subscribes the passed function to the passed message once
   * @function
   * @alias subscribeOnce
   * @param { String } message The message to subscribe to
   * @param { Function } func The function to call when a new message is published
   * @return { PubSub }
   */
  PubSub.subscribeOnce = function (message, func) {
    var token = PubSub.subscribe(message, function () {
      // before func apply, unsubscribe message
      PubSub.unsubscribe(token);
      func.apply(this, arguments);
    });
    return PubSub;
  };

  /**
   * Clears all subscriptions
   * @function
   * @public
   * @alias clearAllSubscriptions
   */
  PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
    messages = {};
  };

  /**
   * Clear subscriptions by the topic
   * @function
   * @public
   * @alias clearAllSubscriptions
   */
  PubSub.clearSubscriptions = function clearSubscriptions(topic) {
    var m;
    for (m in messages) {
      if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
        delete messages[m];
      }
    }
  };

  /**
   * Removes subscriptions
   *
   * - When passed a token, removes a specific subscription.
   *
   * - When passed a function, removes all subscriptions for that function
   *
   * - When passed a topic, removes all subscriptions for that topic (hierarchy)
   * @function
   * @public
   * @alias subscribeOnce
   * @param { String | Function } value A token, function or topic to unsubscribe from
   * @example // Unsubscribing with a token
   * var token = PubSub.subscribe('mytopic', myFunc);
   * PubSub.unsubscribe(token);
   * @example // Unsubscribing with a function
   * PubSub.unsubscribe(myFunc);
   * @example // Unsubscribing from a topic
   * PubSub.unsubscribe('mytopic');
   */
  PubSub.unsubscribe = function (value) {
    var descendantTopicExists = function (topic) {
          var m;
          for (m in messages) {
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
              // a descendant of the topic exists:
              return true;
            }
          }

          return false;
        },
        isTopic = typeof value === 'string' && (messages.hasOwnProperty(value) || descendantTopicExists(value)),
        isToken = !isTopic && typeof value === 'string',
        isFunction = typeof value === 'function',
        result = false,
        m, message, t;

    if (isTopic) {
      PubSub.clearSubscriptions(value);
      return;
    }

    for (m in messages) {
      if (messages.hasOwnProperty(m)) {
        message = messages[m];

        if (isToken && message[value]) {
          delete message[value];
          result = value;
          // tokens are unique, so we can just stop here
          break;
        }

        if (isFunction) {
          for (t in message) {
            if (message.hasOwnProperty(t) && message[t] === value) {
              delete message[t];
              result = true;
            }
          }
        }
      }
    }

    return result;
  };
}));
