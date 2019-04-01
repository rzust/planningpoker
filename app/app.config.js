angular.module('planningPoker').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider.
        when('/', {
          template: '<login class="flex-container"></login>',
          resolve: {
            auth: ['AuthService', function (AuthService) {
              return AuthService.attempLogin().catch(
                function (err) {
                  console.log("Login attemp failed:", err);
                });
            }]
          }
        }).
        when('/dashboard', {
          template: '<session-list my-sessions="false" class="flex-container"></session-list>',
          resolve: {
            auth: ['AuthService', function (AuthService) {
              return AuthService.validateUser();
            }]
          }
        }).
        when('/my_sessions', {
          template: '<session-list my-sessions="true" class="flex-container"></session-list>',
          resolve: {
            auth: ['AuthService', function (AuthService) {
              return AuthService.validateUser();
            }]
          }
        }).
        when('/my_sessions/create', {
          template: '<session-form class="flex-container"></session-form>',
          resolve: {
            auth: ['AuthService', function (AuthService) {
              return AuthService.validateUser();
            }]
          }
        }).
        when('/sessions/:id', {
          template: '<session class="flex-container"></session>',
          resolve: {
            auth: ['AuthService', function (AuthService) {
              return AuthService.validateUser();
            }]
          }
        }).
        otherwise('/');
    }
  ]);

angular.module('planningPoker').run([
  '$rootScope', '$location',
  function ($rootScope, $location) {
    $rootScope.currentPath = $location.path()
    $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
      $rootScope.currentPath = $location.path();
    });
  }
])

