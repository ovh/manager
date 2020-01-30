import angular from 'angular';

import directive from './directive';

import './index.less';

const moduleName = 'cucCloudConsumption';

angular.module(moduleName, []).directive('cucConsumptionChart', directive);

export default moduleName;
