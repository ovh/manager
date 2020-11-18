import set from 'lodash/set';

angular.module('App').config((OvhHttpProvider, constants) => {
  set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
  set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
  set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
  set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
});
