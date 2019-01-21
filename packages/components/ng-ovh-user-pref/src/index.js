import angular from 'angular';

import 'ovh-angular-proxy-request';

import constant from './constant';
import provider from './provider';

const moduleName = 'ngOvhUserPref';

angular
  .module(moduleName, ['ovh-angular-proxy-request'])
  .constant('OVH_USER_PREF', constant)
  .provider('ovhUserPref', provider);

export default moduleName;
