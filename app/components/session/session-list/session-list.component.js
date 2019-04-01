var SessionListController = [
  '$scope',
  '$rootScope',
  '$timeout',
  'SessionService',
  'filterFilter',
  function ($scope, $rootScope, $timeout, SessionService, filterFilter) {
    var self = this;

    activate = function () {
      if (self.mySessions) {
        self.titleSessions = "My Sessions";
        self.titleNoSessions = "You don't have any sessions yet. Create one now?";
        filterAvailableSessions = function (list) {
          return filterFilter(list, { created_by: $rootScope.currentUser.name });
        };
      }
      else {
        self.titleSessions = "Available sessions to join";
        self.titleNoSessions = "Huh, no sessions available. Create one?";
        filterAvailableSessions = function (list) {
          return filterFilter(list, { created_by: '!' + $rootScope.currentUser.name, state: 'Draft' });
        };
      }

      $scope.$on('changed:localStorage', function () {
        $scope.$apply(function () {
          self.sessions = filterAvailableSessions(SessionService.getAll());
        });
      });

      self.sessions = filterAvailableSessions(SessionService.getAll());
    };

    $timeout(function () {
      activate();
    });
  }
]

angular.module('planningPoker').component('sessionList', {
  templateUrl: 'app/components/session/session-list/session-list.template.html',
  bindings: {
    mySessions: '<'
  },
  controller: SessionListController
});