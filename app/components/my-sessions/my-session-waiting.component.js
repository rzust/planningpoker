var MySessionWaitingController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  '$routeParams',
  function (SessionService, Session, $rootScope, $location, $routeParams) {
    var self = this;

    self.start = function () {
      self.startSession();
    }
  }
]

angular.module('planningPoker').component('mySessionWaiting', {
  templateUrl: 'app/components/my-sessions/my-session-waiting.template.html',
  bindings: {
    participants: '=',
    startSession: '&'
  },
  controller: MySessionWaitingController
});