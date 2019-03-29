var AuthService = [
  '$rootScope',
  '$location',
  '$cookies',
  function ($rootScope, $location, $cookies) {
    return {
      attempLogin: function () {
        var promise = new Promise(function (resolve, reject) {
          var user = $cookies.getObject('currentUser');
          if (user) {
            $rootScope.currentUser = user
            $location.path('/dashboard');
            resolve(user);
          }
          else {
            reject('No user found');
          }
        });
        return promise
      },
      validateUser: function () {
        var promise = new Promise(function (resolve, reject) {
          if ($rootScope.currentUser) {
            resolve($rootScope.currentUser);
          }
          else {
            var user = $cookies.getObject('currentUser');
            if (user) {
              $rootScope.currentUser = user
              resolve(user);
            }
            else {
              $location.path('/');
              reject('Not authorized!');
            }
          }
        });
        return promise
      },
      loginUser: function (name) {
        var promise = new Promise(function (resolve, reject) {
          $rootScope.currentUser = { name: name };
          $cookies.putObject('currentUser', $rootScope.currentUser);
          $location.path('/dashboard');
          resolve($rootScope.currentUser);
        });
        return promise
      },
      logoutUser: function () {
        $rootScope.currentUser = null;
        $cookies.remove('currentUser');
        $location.path('/');
      }
    };
  }]

angular.module('planningPoker').factory('AuthService', AuthService)