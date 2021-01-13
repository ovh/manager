import angular from 'angular';

import ovhManagerMetrics from '@ovh-ux/manager-metrics';

import './index.less';

const moduleName = 'metricsApp';

angular.module(moduleName, [ovhManagerMetrics]);

export default moduleName;
