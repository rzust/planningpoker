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