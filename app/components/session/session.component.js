var SessionController = [
  'SessionService',
  '$rootScope',
  '$location',
  '$routeParams',
  'wsSocket',
  '$scope',
  '$timeout',
  function (SessionService, $rootScope, $location, $routeParams, wsSocket, $scope, $timeout) {
    var self = this;
    var listeners = [];

    var updateSession = function (session) {
      self.session = session;
      SessionService.setUpdatedAt(Date.now());
    };

    var calculateOverall = function (estimations, previousEstimations, index) {
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
        previousEstimations.forEach(function (element) { sum += element });
        var overall = Math.round(sum / (estimations.length + previousEstimations.length));
        self.session.stories[index].overall = self.session.scale.values[overall];
        self.session.stories[index].overallInt = overall;
      }
    };

    var destroyListeners = function () {
      listeners.forEach(function (element, index) {
        wsSocket.removeListener(element);
        listeners.splice(index, 1);
      });
    };

    var activate = function () {
      self.session = SessionService.find($routeParams.id);
      self.state = null;

      if (self.session && ($rootScope.currentUser.name == self.session.created_by)) {
        self.moderator = true;
      }
      else {
        self.moderator = false;
      }

      if (!self.session || ((self.session.state != 'Draft') && !self.moderator)) {
        $location.path('/dashboard');
        return;
      }

      var channel = 'session_' + self.session.id;

      listeners.push(channel);
      wsSocket.on(channel, function (data) {
        if (!self.session.participants.includes(data.name)) {
          $scope.$apply(function () {
            self.session.participants.push(data.name);
          });
          SessionService.setUpdatedAt(Date.now());
        }
      });

      listeners.push(channel + '_leave');
      wsSocket.on(channel + '_leave', function (data) {
        $scope.$apply(function () {
          index = self.session.participants.indexOf(data.name)
          if (index != -1) {
            self.session.participants.splice(index, 1);
            SessionService.setUpdatedAt(Date.now());
          }
        });
      });

      listeners.push(channel + '_state');
      wsSocket.on(channel + '_state', function (data) {
        $scope.$apply(function () {

          self.session.state = data.state;
          if (self.session.state == 'Live') {
            $rootScope.$broadcast('changed:localStorage');
          }
          if (self.session.state == 'Finished') {
            self.session = SessionService.setFinishState(self.session);
            self.oldSession = angular.copy(self.session);
            $rootScope.$broadcast('changed:localStorage');
          }
          if (!["Done", "Finished", "Aborted"].includes(self.state) && !self.moderator) {
            self.state = data.stateSecondary;
          }
          SessionService.setUpdatedAt(Date.now());
        });
      });

      if (!self.moderator) {
        listeners.push(channel + '_echo');
        wsSocket.on(channel + '_echo', function () {
          if (!["Done", "Finished", "Aborted"].includes(self.state)) {
            wsSocket.send(channel, $rootScope.currentUser);
          }
        });
        wsSocket.send(channel + '_echo');
      }
      else {
        self.session.participants = [];
        wsSocket.send(channel + '_echo');
      }

      listeners.push(channel + '_saveEstimation');
      wsSocket.on(channel + '_saveEstimation', function (data) {
        $scope.$apply(function () {
          var estimations = self.session.stories[data.index].estimations;
          estimations.push(data.value);
          if (estimations.length == self.session.participants.length) {
            calculateOverall(estimations, self.session.stories[data.index].previousEstimations, data.index);
            if (self.session.stories.length == (data.index + 1)) {
              wsSocket.send(channel + "_state", { state: "Finished", stateSecondary: "Finished" });
            }
          }
          SessionService.setUpdatedAt(Date.now());
        });
      });

      self.startSession = function () {
        wsSocket.send(channel + '_state', { state: 'Live' });
      };

      self.leaveSession = function () {
        wsSocket.send(channel + '_leave', $rootScope.currentUser);
        $location.path("#/dashboard");
      };

      self.finishSession = function () {
        wsSocket.send(channel + '_state', { state: 'Finished', stateSecondary: 'Finished' });
      };

      self.abortSession = function () {
        self.restartSession(true);
        wsSocket.send(channel + '_state', { state: 'Draft', stateSecondary: 'Aborted' });
        $location.path("/sessions/" + self.session.id);
      };

      self.saveEstimation = function (index, value) {
        wsSocket.send(channel + '_saveEstimation', { index: index, value: value });
      };

      self.restartSession = function (reset) {
        if (!self.oldSession) {
          self.oldSession = angular.copy(self.session);
        }
        var hardReset = !((self.session.name == self.oldSession.name) && (self.session.scale == self.oldSession.scale) && (self.session.stories.length == self.oldSession.stories.length));
        var reformattedStories = [];
        self.session.stories.forEach(function (element) {
          if (reset || hardReset) {
            element.previousEstimations = [];
          }
          else {
            if (!element.estimations.includes(-1) && !element.estimations.includes(-2)) {
              element.previousEstimations = element.estimations;
            }
          }
          story = { description: element.description, estimations: [], previousEstimations: element.previousEstimations, overall: null, overallInt: null };
          reformattedStories.push(story);
        });
        self.session.state = 'Draft';
        self.session.finishState = [];
        self.session.participants = [];
        self.session.stories = reformattedStories;

        self.state = "";

        SessionService.update(self.session);
      };

      $scope.$on('$destroy', function () {
        if (self.session.state == 'Draft') {
          wsSocket.send(channel + '_leave', $rootScope.currentUser);
        }
        SessionService.callSync();
        destroyListeners();
      });
    }

    $timeout(function () {
      activate();
    });
  }
]

angular.module('planningPoker').component('session', {
  templateUrl: 'app/components/session/session.template.html',
  controller: SessionController
});