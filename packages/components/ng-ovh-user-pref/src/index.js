import angular from 'angular';

import '@ovh-ux/ng-ovh-proxy-request';

import constant from './constant';
import provider from './provider';

const moduleName = 'ngOvhUserPref';

angular
  .module(moduleName, [
    'ngOvhProxyRequest',
  ])
  .constant('OVH_USER_PREF', constant)
  .provider('ovhUserPref', provider);

export default moduleName;
