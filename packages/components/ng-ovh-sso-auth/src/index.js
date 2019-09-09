import angular from 'angular';
import 'angular-cookies';

import factory from './factory';
import provider from './provider';

const moduleName = 'ngOvhSsoAuth';

angular
  .module(moduleName, ['ngCookies'])
  .factory('OvhSsoAuthInterceptor', factory)
  .provider('ssoAuthentication', provider);

export default moduleName;
