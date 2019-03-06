
export default function () {
  const tokens = {};
  const self = this;

  self.put = function putToken(projectId, userId, openstackTokens) {
    if (!tokens[projectId]) {
      tokens[projectId] = {};
    }

    tokens[projectId][userId] = openstackTokens;
    return true;
  };

  self.get = function getToken(projectId, userId) {
    if (!tokens[projectId]) {
      return undefined;
    }
    return tokens[projectId][userId];
  };

  self.delete = function deleteToken(projectId, userId) {
    if (tokens[projectId] && tokens[projectId][userId]) {
      delete tokens[projectId][userId];
    }
    return true;
  };
}
