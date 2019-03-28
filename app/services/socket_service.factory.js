
var wsSocket = [function () {
  var stack = [];
  var listeners = [];
  var connection = new WebSocket("ws://dlabs.si:1234")
  var wssocket = {
    ws: connection,
    send: function (channel, data) {
      data = JSON.stringify({ channel: channel, data: data });
      if (connection.readyState == 1) {
        connection.send(data);
      } else {
        stack.push(data);
      }
    },
    on: function (channel, callback) {
      listeners.push({ channel: channel, callback: callback });
    }
  };

  connection.onerror = function (err) {
    console.log("WS Error:", err)
  };

  connection.onclose = function (event) {
    console.log("WS closed:", event);
  };

  connection.onmessage = function (event) {
    var data = JSON.parse(event.data);
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener.channel == data.channel)
        listener.callback(data.data);
    }
  };

  connection.onopen = function (event) {
    for (i in stack) {
      connection.send(stack[i]);
    }
    stack = [];
  };
  // connection.OPEN

  return wssocket;
}];

angular.module('planningPoker').factory('wsSocket', wsSocket)