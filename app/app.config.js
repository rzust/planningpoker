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
          template: '',
          resolve: {
            auth: ['AuthService', '$location', function (AuthService, $location) {
              return AuthService.validateUser();
            }]
          }
        }).
        when('/my_sessions', {
          template: '',
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

