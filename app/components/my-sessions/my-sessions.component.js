var MySessionsController = [
  '$scope',
  'SessionService',
  function ($scope, SessionService) {
    var self = this;

    $scope.$on('changed:localStorage', function () {
      $scope.$apply(function () {
        self.sessions = SessionService.getAll();
      });
    });

    self.sessions = SessionService.getAll();
  }
]

angular.module('planningPoker').component('mySessions', {
  templateUrl: 'app/components/my-sessions/my-sessions.template.html',
  controller: MySessionsController
});