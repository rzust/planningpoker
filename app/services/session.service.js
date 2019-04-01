var SessionService = [
  'Session',
  '$rootScope',
  'wsSocket',
  function (Session, $rootScope, wsSocket) {
    self = this

    self.setUpdatedAt = function (createdAt) {
      Session.setUpdatedAt(createdAt);
    };

    wsSocket.on("callSync", function (data) {
      if (data.name != $rootScope.currentUser.name) {
        self.sendSync()
      }
    });

    wsSocket.on("sync", function (data) {
      if (data.updated_at) {
        if (!Session.getUpdatedAt() || (Session.getUpdatedAt() < data.updated_at)) {
          Session.setUpdatedAt(data.updated_at);
          Session.setAll(data.sessions);
          $rootScope.$broadcast('changed:localStorage');
        }
      }
    });

    wsSocket.on("sessionCreated", function (data) {
      if (data.session && (data.session.created_by != $rootScope.currentUser.name)) {
        Session.add(data.session);
        if (Session.getUpdatedAt() < data.created_at) {
          Session.setUpdatedAt(data.created_at);
        }
        $rootScope.$broadcast('changed:localStorage');
      }
    });

    self.sendSync = function () {
      wsSocket.send("sync", { updated_at: Session.getUpdatedAt(), sessions: Session.getAll() });
    };

    self.getAll = function () {
      return Session.getAll();
    };

    self.find = function (id) {
      self.callSync();
      return Session.get(id);
    };

    self.update = function (session) {
      var session = Session.get(session.id);
      var sessions = Session.getAll();
      var index = sessions.indexOf(session);
      sessions[index] = session;
      Session.setUpdatedAt(Date.now());
      self.sendSync();
    };

    self.add = function (name, scale, created_by, stories) {
      var session = new Session(name, scale, created_by, stories);
      Session.add(session);
      wsSocket.send("sessionCreated", { session: session, created_at: Date.now() });
      return session;
    };

    self.setFinishState = function (session) {
      var info, undoable, disconnect;
      session.stories.forEach(function (element) {
        if ((element.estimations.length != session.participants.length) && !disconnect) {
          session.finishState.push('Disconnect');
          disconnect = true;
        }
        if (element.overall == 'Info') {
          session.finishState.push('Info');
          info = true;
        }
        if (element.overall == 'Undoable') {
          session.finishState.push('Undoable');
          undoable = true;
        }
      });
      if (!disconnect && !info && !undoable)
        session.finishState.push('Complete');
      Session.setUpdatedAt(Date.now());
      return session;
    };

    self.callSync = function () {
      wsSocket.send("callSync", $rootScope.currentUser);
    };

    self.callSync();
  }
]

angular.module('planningPoker').service('SessionService', SessionService)
