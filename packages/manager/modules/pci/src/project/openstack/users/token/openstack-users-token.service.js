

angular.module('managerApp')
  .service('OpenstackUsersToken', function () {
    const tokens = {};
    const self = this;

    self.put = function (projectId, userId, openstackTokens) {
      if (!tokens[projectId]) {
        tokens[projectId] = {};
      }

      tokens[projectId][userId] = openstackTokens;
      return true;
    };

    self.get = function (projectId, userId) {
      if (!tokens[projectId]) {
        return undefined;
      }
      return tokens[projectId][userId];
    };

    self.delete = function (projectId, userId) {
      if (tokens[projectId] && tokens[projectId][userId]) {
        delete tokens[projectId][userId];
      }
      return true;
    };
  });
