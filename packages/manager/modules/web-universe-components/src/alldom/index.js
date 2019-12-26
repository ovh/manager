import angular from 'angular';

import '@ovh-ux/ng-ovh-http';

import WucAllDom from './domain-alldom.service';

const moduleName = 'wucAllDom';

angular.module(moduleName, ['ngOvhHttp']).service('WucAllDom', WucAllDom);

export default moduleName;
