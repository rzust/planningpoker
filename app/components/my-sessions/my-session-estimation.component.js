var MySessionEstimationController = [
  function () {
    var self = this;

    self.start = function () {
      self.startSession();
    }
  }
]

angular.module('planningPoker').component('mySessionEstimation', {
  templateUrl: 'app/components/my-sessions/my-session-estimation.template.html',
  bindings: {
    state: '=',
    session: '=',
    finishSession: '&',
    abortSession: '&'
  },
  controller: MySessionEstimationController
});