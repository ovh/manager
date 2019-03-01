

angular.module('managerApp').service('OpenstackUsersPassword',
  function () {
    const passwords = {};
    const self = this;

    self.put = function (projectId, userId, password) {
      if (!passwords[projectId]) {
        passwords[projectId] = {};
      }

      passwords[projectId][userId] = password;
      return true;
    };

    self.get = function (projectId, userId) {
      if (!passwords[projectId]) {
        return undefined;
      }
      return passwords[projectId][userId];
    };

    self.delete = function (projectId, userId) {
      if (passwords[projectId] && passwords[projectId][userId]) {
        delete passwords[projectId][userId];
      }
      return true;
    };
  });
