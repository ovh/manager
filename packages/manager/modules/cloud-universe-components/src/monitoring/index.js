import angular from 'angular';

import directive from './directive';

import './index.less';

const moduleName = 'cucCloudMonitoring';

angular.module(moduleName, []).directive('cucMonitoringChart', directive);

export default moduleName;
