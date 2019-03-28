var SessionWaitController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  '$routeParams',
  function (SessionService, Session, $rootScope, $location, $routeParams) {
    var self = this;

    self.leave = function () {
      self.leaveSession();
    }
  }
]

angular.module('planningPoker').component('sessionWait', {
  templateUrl: 'app/components/session/session-wait.template.html',
  bindings: {
    leaveSession: '&',
    createdBy: '<'
  },
  controller: SessionWaitController
});