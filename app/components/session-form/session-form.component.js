var SessionFormController = [
  'SessionService',
  'Session',
  'Socket',
  '$rootScope',
  '$location',
  function (SessionService, Session, Socket, $rootScope, $location) {
    var self = this;
    self.scales = Session.possibleScales;

    self.saveSession = function () {
      session = SessionService.add(self.session.name, self.session.scale, $rootScope.currentUser.name);
      console.log("Session created:", session);
      $location.path("/dashboard");
    }
  }
]

angular.module('planningPoker').component('sessionForm', {
  templateUrl: 'app/components/session-form/session-form.template.html',
  controller: SessionFormController
});