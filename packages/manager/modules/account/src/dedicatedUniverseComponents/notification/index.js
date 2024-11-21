import angular from 'angular';

import '@ovh-ux/ng-ovh-user-pref';

import DucNotification from './notification.service';

const moduleName = 'ducNotification';

angular
  .module(moduleName, ['ngOvhUserPref'])
  .service('DucNotification', DucNotification);

export default moduleName;
