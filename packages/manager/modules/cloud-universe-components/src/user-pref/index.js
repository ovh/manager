import angular from 'angular';
import '@ovh-ux/ng-ovh-user-pref';

import service from './service';

const moduleName = 'cucCloudUserPref';

angular.module(moduleName, ['ngOvhUserPref']).service('CucUserPref', service);

export default moduleName;
