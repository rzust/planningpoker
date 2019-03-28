var SessionController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  '$routeParams',
  'wsSocket',
  '$scope',
  function (SessionService, Session, $rootScope, $location, $routeParams, wsSocket, $scope) {
    var self = this;
    self.session = SessionService.find($routeParams.id);
    self.participants = [];
    self.estimations = [];
    self.state = null;
    self.moderator = false;

    var channel = "session_" + self.session.id;

    wsSocket.on(channel, function (data) {
      $scope.$apply(function () {
        if (!self.participants.includes(data.name)) {
          self.participants.push(data.name);
        }
      });
    });

    if ($rootScope.currentUser.name != self.session.created_by) {
      wsSocket.send(channel, $rootScope.currentUser)

      wsSocket.on(channel + "echo", function () {
        wsSocket.send(channel, $rootScope.currentUser)
      });
    }
    else {
      self.moderator = true;
      wsSocket.send(channel + "echo")
    }

    wsSocket.on(channel + "state", function (data) {
      $scope.$apply(function () {
        console.log(data);
        self.session.state = data.state;
        if (data.stateSecondary)
          self.state = data.stateSecondary;
      });
    });

    wsSocket.on(channel + "_saveEstimation", function (data) {
      var estimations = self.session.stories[data.index].estimations;
      estimations.push(data.value);
      if (estimations.length == self.participants.length) {
        var sum = 0;
        estimations.forEach(function (element) { sum += element });
        overall = Math.round(sum / estimations.length);
        self.session.stories[data.index].overall = self.session.scale.values[overall];
      }
    });

    self.startSession = function () {
      wsSocket.send(channel + "state", { state: "Live" })
      // SessionService.update(self.session.id, self.session)
    }

    self.leaveSession = function () {
      console.log("leave");
    }

    self.finishSession = function () {
      wsSocket.send(channel + "state", { state: "Live", stateSecondary: "Finished" });
    }

    self.abortSession = function () {
      wsSocket.send(channel + "state", { state: "Live", stateSecondary: "Aborted" });
    }

    self.saveEstimation = function (index, value) {
      console.log(index, value);
      wsSocket.send(channel + "_saveEstimation", { index: index, value: value });
    }
  }
]

angular.module('planningPoker').component('session', {
  templateUrl: 'app/components/session/session.template.html',
  controller: SessionController
});