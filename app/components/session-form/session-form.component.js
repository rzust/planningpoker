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
      self.session.stories.push({ desc: "" });
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

angular.module('planningPoker').component('sessionForm', {
  templateUrl: 'app/components/session-form/session-form.template.html',
  controller: SessionFormController
});