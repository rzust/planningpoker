var LoginController = ['AuthService',
  function (AuthService) {
    var self = this;
    self.loginUser = function () {
      AuthService.loginUser(self.username).then(
        function (rsp) {
          console.log("Authenticated:", rsp);
        }
      );
    };
  }
]

angular.module('planningPoker').component('login', {
  templateUrl: 'app/components/login/login.template.html',
  controller: LoginController
});