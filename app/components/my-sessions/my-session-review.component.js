angular.module('planningPoker').component('mySessionReview', {
  templateUrl: 'app/components/my-sessions/my-session-review.template.html',
  bindings: {
    finishState: '<',
    runAgain: '&'
  }
});