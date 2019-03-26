var Socket = ['socketFactory', function (socketFactory) {
  var connection = io.connect('ws://dlabs.si:1234');

  socket = socketFactory({
    ioSocket: connection
  });

  return socket;
}];

angular.module('planningPoker').factory('Socket', Socket)