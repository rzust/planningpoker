var SessionEstimationController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  '$routeParams',
  function (SessionService, Session, $rootScope, $location, $routeParams) {
    var self = this;
    self.index = 0;
    self.estimations = [];
    self.setValue = function (value) {
      console.log("value:", value, "index:", self.index);
      self.saveEstimation({ index: self.index, value: value });
      self.index++;
      if (self.index > self.session.stories.length - 1) {
        self.state = "Done";
      }
    };

  }
]

angular.module('planningPoker').component('sessionEstimation', {
  templateUrl: 'app/components/session/session-estimation.template.html',
  bindings: {
    session: '<',
    state: '=',
    saveEstimation: '&'
  },
  controller: SessionEstimationController
});