var SessionFormController = [
  'SessionService',
  'Session',
  '$rootScope',
  '$location',
  function (SessionService, Session, $rootScope, $location) {
    var self = this;
    self.scales = Session.possibleScales;

    self.session = { stories: [] };

    self.addStory = function () {
      self.session.stories.push({ description: "", estimations: [], overall: null });
    }

    self.removeStory = function (index) {
      self.session.stories.splice(index, 1);
    }

    self.saveSession = function () {
      session = SessionService.add(self.session.name, self.session.scale, $rootScope.currentUser.name, self.session.stories);
      $location.path("/my_sessions");
    }
  }
]

angular.module('planningPoker').directive('focusInput', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        return $timeout(function () {
          return elem[0].focus();
        });
      }
    };
  }
]);

angular.module('planningPoker').component('sessionForm', {
  templateUrl: 'app/components/session-form/session-form.template.html',
  controller: SessionFormController
});