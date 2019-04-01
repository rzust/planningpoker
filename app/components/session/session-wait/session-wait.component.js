var SessionWaitController = [
  function () {
    var self = this;
  }
]

angular.module('planningPoker').component('sessionWait', {
  templateUrl: 'app/components/session/session-wait/session-wait.template.html',
  bindings: {
    leaveSession: '&',
    createdBy: '<'
  },
  controller: SessionWaitController
});