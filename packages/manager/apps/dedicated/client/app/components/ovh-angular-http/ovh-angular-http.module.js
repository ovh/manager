angular
  .module('App')
  .config((OvhHttpProvider, constants) => {
    _.set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
    _.set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    _.set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
    _.set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
  });
