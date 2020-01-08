angular
  .module('managerApp')
  .service('OpenstackUsersToken', function OpenstackUsersToken() {
    const tokens = {};
    const self = this;

    self.put = function put(projectId, userId, openstackTokens) {
      if (!tokens[projectId]) {
        tokens[projectId] = {};
      }

      tokens[projectId][userId] = openstackTokens;
      return true;
    };

    self.get = function get(projectId, userId) {
      if (!tokens[projectId]) {
        return undefined;
      }
      return tokens[projectId][userId];
    };

    self.delete = function deleteFn(projectId, userId) {
      if (tokens[projectId] && tokens[projectId][userId]) {
        delete tokens[projectId][userId];
      }
      return true;
    };
  });
