var MySessionsController = [
  'SessionService',
  function (SessionService) {
    var self = this;

    self.sessions = SessionService.getAll()
  }
]

angular.module('planningPoker').component('mySessions', {
  templateUrl: 'app/components/my-sessions/my-sessions.template.html',
  controller: MySessionsController
});