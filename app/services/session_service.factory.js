var Session = [
  function () {
    function Session(id, name, scale, created_by) {
      this.id = id;
      this.name = name;
      this.scale = scale;
      this.created_by = created_by;
      this.state = 'Draft';
    }
    var possibleScales = [
      { name: "Fibonacci", values: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100] },
      { name: "T-Shirt", values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: "Gamer", values: ['Easy', 'Medium', 'Hard'] }
    ];

    Session.possibleScales = angular.copy(possibleScales);

    return Session;
  }
]

var SessionService = [
  '$localStorage',
  'Session',
  function ($localStorage, Session) {
    self = this

    self.getAll = function () {
      if (!$localStorage.sessions) {
        $localStorage.sessions = [];
      }
      return $localStorage.sessions
    };

    self.add = function (name, scale, created_by) {
      if (!$localStorage.sessions) {
        $localStorage.sessions = [];
      }
      id = $localStorage.sessions.length + 1;
      session = new Session(id, name, scale, created_by);
      $localStorage.sessions.push(session);
      return session;
    };

    self.update = function (index, session) {
      $localStorage.sessions[index] = session
    }
  }
]

angular.module('planningPoker').factory('Session', Session)
angular.module('planningPoker').service('SessionService', SessionService)
