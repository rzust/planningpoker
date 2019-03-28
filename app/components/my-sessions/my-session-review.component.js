var MySessionReviewController = [
  function () {
    var self = this;
  }
]

angular.module('planningPoker').component('mySessionReview', {
  templateUrl: 'app/components/my-sessions/my-session-review.template.html',
  bindings: {
    session: '='
  },
  controller: MySessionReviewController
});