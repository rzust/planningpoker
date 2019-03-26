angular.module('planningPoker').component('navBar', {
  templateUrl: 'app/components/navbar/nav-bar.template.html',
  controller: ['AuthService',
    function NavBarController(AuthService) {
      self = this;
      self.logoutUser = function () {
        AuthService.logoutUser();
      };
    }
  ]
});