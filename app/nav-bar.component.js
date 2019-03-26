angular.module('planningPoker').component('navBar', {
  templateUrl: 'app/nav-bar.template.html',
  controller: ['$location',
    function NavBarController($location) {
      if ($location.path() === '') {
        this.hidden = true;
      }
      else {
        this.hidden = false;
      }
    }
  ]
});