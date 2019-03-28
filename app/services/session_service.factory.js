var Session = [
  '$localStorage',
  function ($localStorage) {
    function Session(id, name, scale, created_by, stories) {
      this.id = id;
      this.name = name;
      this.scale = scale;
      this.created_by = created_by;
      this.stories = stories;
      this.state = 'Draft';
    }

    Session.prototype.getStory = function () {
      return Date.now;
    };

    var possibleScales = [
      { name: "Fibonacci", values: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100] },
      { name: "T-Shirt", values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: "Gamer", values: ['Easy', 'Medium', 'Hard'] }
    ];

    Session.possibleScales = angular.copy(possibleScales);

    Session.getAll = function () {
      return $localStorage.sessions;
    };

    return Session;
  }
]

var SessionService = [
  '$localStorage',
  'Session',
  '$rootScope',
  'wsSocket',
  function ($localStorage, Session, $rootScope, wsSocket) {
    self = this

    if (!$localStorage.sessions) {
      $localStorage.sessions = [];
    }

    wsSocket.on("callSync", function (data) {
      self.sendSync()
    });

    wsSocket.on("sync", function (data) {
      if (data.updated_at) {
        if (!$localStorage.sessions_updated_at || ($localStorage.sessions_updated_at < data.updated_at)) {
          $localStorage.sessions_updated_at = data.updated_at;
          $localStorage.sessions = data.sessions;
          $rootScope.$broadcast('changed:localStorage', {});
        }
      }
    });

    wsSocket.on("sessionCreated", function (data) {
      if (data.session && (data.session.created_by != $rootScope.currentUser.name)) {
        $localStorage.sessions.push(data.session);
        if ($localStorage.sessions_updated_at < data.created_at) {
          $localStorage.sessions_updated_at = data.created_at;
        }
        $rootScope.$broadcast('changed:localStorage', {});
      }
    });

    callSync = function () {
      wsSocket.send("callSync", { name: "planningPoker" });
    };

    self.sendSync = function () {
      wsSocket.send("sync", { updated_at: $localStorage.sessions_updated_at, sessions: $localStorage.sessions });
    };

    self.getAll = function () {
      return Session.getAll();
    };

    self.find = function (id) {
      var session = $localStorage.sessions.find(function (element) {
        return element.id == id;
      });
      return session;
    };

    self.add = function (name, scale, created_by, stories) {
      id = $localStorage.sessions.length + 1;
      session = new Session(id, name, scale, created_by, stories);
      $localStorage.sessions.push(session);
      $localStorage.sessions_updated_at = Date.now();
      wsSocket.send("sessionCreated", { session: session, created_at: $localStorage.sessions_updated_at });
      return session;
    };

    self.update = function (id, session) {
      session = self.find(id);
      index = $localStorage.sessions.indexOf(session);
      $localStorage.sessions[index] = session;
      self.sendSync();
    };

    // self.saveEstimation = function (id, index, value) {
    //   session = self.find(id);
    //   sessionIndex = $localStorage.sessions.indexOf(session);
    //   $localStorage.sessions[sessionIndex].stories[index].estimations.push(value);
    // }

    // self.calculateOverall = function (id, index) {
    //   session = self.find(id);
    //   sessionIndex = $localStorage.sessions.indexOf(session);
    //   var sum = 0;
    //   estimations = $localStorage.sessions[sessionIndex].stories[index].estimations;
    //   estimations.forEach(function (element) {
    //     sum += element;
    //   });
    //   overall = Math.round(sum / estimations.length);
    //   $localStorage.sessions[sessionIndex].stories[index].overall = $localStorage.sessions[sessionIndex].scale.values[overall];
    // }

    callSync();
  }
]

angular.module('planningPoker').factory('Session', Session)
angular.module('planningPoker').service('SessionService', SessionService)
