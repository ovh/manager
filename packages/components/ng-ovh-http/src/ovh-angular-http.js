import angular from 'angular';
import OvhHttpProvider from './ovh-angular-http.provider';

const moduleName = 'ovh-angular-http';

angular
  .module(moduleName, [])
  .provider('OvhHttp', OvhHttpProvider);

export default moduleName;
