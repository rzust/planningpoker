var SessionEstimationController = [
  '$interval',
  function ($interval) {
    var self = this;
    self.index = 0;
    self.estimations = [];
    self.seconds = 30;

    var timeout = function () {
      self.seconds--;
      if (self.session.state == 'Live') {
        if (self.seconds <= 0) {
          self.setValue(-1);
          self.seconds = 30;
        }
      }
      else {
        $interval.cancel(self.estimationInterval);
      }
    };

    self.estimationInterval = $interval(timeout, 1000);

    self.setValue = function (value) {
      self.seconds = 30;
      self.saveEstimation({ index: self.index, value: value });
      self.index++;
      if (self.index > self.session.stories.length - 1) {
        $interval.cancel(self.estimationInterval);
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