
export default function () {
  const passwords = {};
  const self = this;

  self.put = function put(projectId, userId, password) {
    if (!passwords[projectId]) {
      passwords[projectId] = {};
    }

    passwords[projectId][userId] = password;
    return true;
  };

  self.get = function get(projectId, userId) {
    if (!passwords[projectId]) {
      return undefined;
    }
    return passwords[projectId][userId];
  };

  self.delete = function deletePassword(projectId, userId) {
    if (passwords[projectId] && passwords[projectId][userId]) {
      delete passwords[projectId][userId];
    }
    return true;
  };
}
