var Session = [
  '$localStorage',
  function ($localStorage) {
    if (!$localStorage.sessions) {
      $localStorage.sessions = [];
    }

    function Session(name, scale, created_by, stories) {
      this.id = Session.count() + 1;
      this.name = name;
      this.scale = scale;
      this.created_by = created_by;
      this.stories = stories;
      this.state = 'Draft';
      // String: Complete, Info, Undoable, Disconnect
      this.finishState = [];
      this.participants = [];
    }

    // -1 = Needs info
    // -2 = Undoable
    var possibleScales = [
      { name: "Fibonacci", values: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100] },
      { name: "T-Shirt", values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: "Gamer", values: ['Easy', 'Medium', 'Hard'] }
    ];

    Session.possibleScales = angular.copy(possibleScales);

    Session.get = function (id) {
      var session = $localStorage.sessions.find(function (element) {
        return element.id == id;
      });
      return session;
    };

    Session.getAll = function () {
      return $localStorage.sessions;
    };

    Session.setAll = function (sessions) {
      $localStorage.sessions = sessions;
    };

    Session.getUpdatedAt = function () {
      return $localStorage.sessions_updated_at;
    };

    Session.setUpdatedAt = function (updatedAt) {
      $localStorage.sessions_updated_at = updatedAt;
    }

    Session.add = function (session) {
      $localStorage.sessions.push(session);
      Session.setUpdatedAt(Date.now());
    }

    Session.count = function () {
      return $localStorage.sessions.length;
    }

    return Session;
  }
]

angular.module('planningPoker').factory('Session', Session)