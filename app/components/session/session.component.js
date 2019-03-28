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
    self.state = null;

    if (self.session && ($rootScope.currentUser.name == self.session.created_by)) {
      self.moderator = true;
    }
    else {
      self.moderator = false;
    }

    if (!self.session || ((self.session.state != 'Draft') && !self.moderator)) {
      $location.path("#/dashboard");
      return;
    }

    var channel = "session_" + self.session.id;

    wsSocket.on(channel, function (data) {
      $scope.$apply(function () {
        if (!self.session.participants.includes(data.name)) {
          self.session.participants.push(data.name);
          SessionService.setUpdatedAt(Date.now());
        }
      });
    });

    wsSocket.on(channel + "_leave", function (data) {
      $scope.$apply(function () {
        index = self.session.participants.indexOf(data.name)
        if (index != -1) {
          self.session.participants.splice(index, 1);
          SessionService.setUpdatedAt(Date.now());
        }
      });
    });

    if (!self.moderator) {
      wsSocket.send(channel, $rootScope.currentUser);

      wsSocket.on(channel + "echo", function () {
        wsSocket.send(channel, $rootScope.currentUser);
      });
    }
    else {
      wsSocket.send(channel + "echo");
    }

    wsSocket.on(channel + "state", function (data) {
      $scope.$apply(function () {
        self.session.state = data.state;
        SessionService.setUpdatedAt(Date.now());
        if (self.session.state == 'Finished') {
          SessionService.setFinishState(self.session);
        }
        if (!["Done", "Finished", "Aborted"].includes(self.state)) {
          if (data.stateSecondary)
            self.state = data.stateSecondary;
        }
      });
    });

    calculateOverall = function (estimations, index) {
      $scope.$apply(function () {
        if (estimations.includes(-1) || estimations.includes(-2)) {
          // giving priority to needs more information over undoable
          if (estimations.includes(-1)) {
            self.session.stories[index].overall = 'Info';
            self.session.stories[index].overallInt = -1;
          }
          if (estimations.includes(-2)) {
            self.session.stories[index].overall = 'Undoable';
            self.session.stories[index].overallInt = -2;
          }
        }
        else {
          var sum = 0;
          estimations.forEach(function (element) { sum += element });
          overall = Math.round(sum / estimations.length);
          self.session.stories[index].overall = self.session.scale.values[overall];
          self.session.stories[index].overallInt = overall;
        }
        SessionService.setUpdatedAt(Date.now());
      });
    };

    wsSocket.on(channel + "_saveEstimation", function (data) {
      var estimations = self.session.stories[data.index].estimations;
      estimations.push(data.value);
      SessionService.setUpdatedAt(Date.now());
      if (estimations.length == self.session.participants.length) {
        calculateOverall(estimations, data.index);
        if (self.session.stories.length == (data.index + 1)) {
          wsSocket.send(channel + "state", { state: "Finished", stateSecondary: "Finished" });
        }
      }
    });

    self.startSession = function () {
      wsSocket.send(channel + "state", { state: "Live" });
    }

    self.leaveSession = function () {
      wsSocket.send(channel + "_leave", $rootScope.currentUser);
      $location.path("#/dashboard");
    }

    self.finishSession = function () {
      wsSocket.send(channel + "state", { state: "Finished", stateSecondary: "Finished" });
    }

    self.abortSession = function () {
      wsSocket.send(channel + "state", { state: "Draft", stateSecondary: "Aborted" });
    }

    self.saveEstimation = function (index, value) {
      wsSocket.send(channel + "_saveEstimation", { index: index, value: value });
    }

  }
]

angular.module('planningPoker').component('session', {
  templateUrl: 'app/components/session/session.template.html',
  controller: SessionController
});