var SessionsController = [
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

angular.module('planningPoker').component('sessions', {
  templateUrl: 'app/components/sessions/sessions.template.html',
  controller: SessionsController
});