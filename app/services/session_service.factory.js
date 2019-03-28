var Session = [
  '$localStorage',
  function ($localStorage) {
    if (!$localStorage.sessions) {
      $localStorage.sessions = [];
    }

    function Session(name, scale, created_by, stories) {
      this.id = Session.count + 1;
      this.name = name;
      this.scale = scale;
      this.created_by = created_by;
      this.stories = stories;
      this.state = 'Draft';
    }

    // Session.prototype = {
    //   get fullName() {
    //     return this.first + " " + this.last;
    //   },

    //   set fullName(name) {
    //     var names = name.split(" ");
    //     this.first = names[0];
    //     this.last = names[1];
    //   }
    // };

    var possibleScales = [
      { name: "Fibonacci", values: [0, 1, 2, 3, 5, 8, 13, 20, 40, 100] },
      { name: "T-Shirt", values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { name: "Gamer", values: ['Easy', 'Medium', 'Hard'] }
    ];

    Session.possibleScales = angular.copy(possibleScales);

    Session.getAll = function () {
      return $localStorage.sessions;
    };

    Session.setAll = function (sessions) {
      $localStorage.sessions = sessions;
    };

    Session.updatedAt = $localStorage.sessions_updated_at;

    Session.setUpdatedAt = function (updatedAt) {
      $localStorage.sessions_updated_at = updatedAt;
    }

    Session.add = function (session) {
      $localStorage.sessions.push(session);
    }

    Session.count = $localStorage.sessions.length;

    return Session;
  }
]

var SessionService = [
  'Session',
  '$rootScope',
  'wsSocket',
  function (Session, $rootScope, wsSocket) {
    self = this

    wsSocket.on("callSync", function (data) {
      self.sendSync()
    });

    wsSocket.on("sync", function (data) {
      if (data.updated_at) {
        if (!Session.updatedAt || (Session.updatedAt < data.updated_at)) {
          Session.setUpdatedAt(data.updated_at);
          Session.setAll(data.sessions);
          $rootScope.$broadcast('changed:localStorage', {});
        }
      }
    });

    wsSocket.on("sessionCreated", function (data) {
      if (data.session && (data.session.created_by != $rootScope.currentUser.name)) {
        Session.add(data.session);
        if (Session.updatedAt < data.created_at) {
          Session.setUpdatedAt(data.created_at);
        }
        $rootScope.$broadcast('changed:localStorage', {});
      }
    });

    callSync = function () {
      wsSocket.send("callSync", { name: "planningPoker" });
    };

    self.sendSync = function () {
      wsSocket.send("sync", { updated_at: Session.updatedAt, sessions: Session.getAll() });
    };

    self.getAll = function () {
      return Session.getAll();
    };

    self.find = function (id) {
      var session = Session.getAll().find(function (element) {
        return element.id == id;
      });
      return session;
    };

    self.add = function (name, scale, created_by, stories) {
      session = new Session(name, scale, created_by, stories);
      Session.add(session);
      Session.setUpdatedAt(Date.now());
      wsSocket.send("sessionCreated", { session: session, created_at: Session.updatedAt });
      return session;
    };

    // self.update = function (id, session) {
    //   session = self.find(id);
    //   index = $localStorage.sessions.indexOf(session);
    //   $localStorage.sessions[index] = session;
    //   self.sendSync();
    // };

    callSync();
  }
]

angular.module('planningPoker').factory('Session', Session)
angular.module('planningPoker').service('SessionService', SessionService)
