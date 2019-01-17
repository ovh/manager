import angular from 'angular';
import 'ovh-angular-proxy-request';
import userPrefConstant from './ovh-angular-user-pref.constant';
import userPrefProvider from './ovh-angular-user-pref.provider';

const moduleName = 'ovh-angular-user-pref';

angular
  .module(moduleName, ['ovh-angular-proxy-request'])
  .constant('OVH_USER_PREF', userPrefConstant)
  .provider('ovhUserPref', userPrefProvider);

export default moduleName;
