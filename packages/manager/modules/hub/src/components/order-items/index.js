import angular from 'angular';

import component from './order-items.component';

const moduleName = 'ovhManagerHubOrderItems';

angular.module(moduleName, []).component('hubOrderItems', component);

export default moduleName;
