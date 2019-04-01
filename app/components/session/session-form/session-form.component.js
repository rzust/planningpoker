var SessionFormController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  '$timeout',
  function (SessionService, Session, $rootScope, $location, $timeout) {
    var self = this;
    self.scales = Session.possibleScales;

    activate = function () {
      self.getSession = function () {
        if (typeof self.session != "undefined") {
          return self.session;
        }
        return { stories: [] };
      };

      self.session = self.getSession();

      self.addStory = function () {
        self.session.stories.push({ description: "", estimations: [], previousEstimations: [], overall: null, overallInt: null });
      }

      self.removeStory = function (index) {
        self.session.stories.splice(index, 1);
      }

      self.saveSession = function () {
        session = SessionService.add(self.session.name, self.session.scale, $rootScope.currentUser.name, self.session.stories);
        $location.path("/sessions/" + session.id);
      }

      self.runAgain = function (reset) {
        self.restartSession({ reset: reset });
        $location.path("/sessions/" + self.session.id);
      };
    };

    $timeout(function () {
      activate();
    });
  }
]

angular.module('planningPoker').component('sessionForm', {
  templateUrl: 'app/components/session/session-form/session-form.template.html',
  bindings: {
    session: '<',
    restartSession: '&'
  },
  controller: SessionFormController
});