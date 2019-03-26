angular.module('planningPoker').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          template: '<login></login>'
        }).
        when('/dashboard', {
          template: ''
        }).
        when('/my_sessions', {
          template: ''
        }).
        otherwise('/');
    }
  ]);