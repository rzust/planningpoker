angular.module('planningPoker').component('mySessionWaiting', {
  templateUrl: 'app/components/my-sessions/my-session-waiting.template.html',
  bindings: {
    participants: '=',
    startSession: '&'
  }
});