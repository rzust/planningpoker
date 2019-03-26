var SessionsController = [
  'SessionService',
  function (SessionService) {
    var self = this;

    self.sessions = SessionService.getAll()
  }
]

angular.module('planningPoker').component('sessions', {
  templateUrl: 'app/components/sessions/sessions.template.html',
  controller: SessionsController
});