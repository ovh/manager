const multimatch = require('multimatch');

module.exports = (infos, filters = []) => {
  if (filters.length) {
    return infos.filter((fragment) => {
      return multimatch([fragment.name], filters)[0] === fragment.name;
    });
  }
  return infos;
};
