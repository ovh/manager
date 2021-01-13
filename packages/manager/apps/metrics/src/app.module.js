import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerMetrics from '@ovh-ux/manager-metrics';

import './index.less';

const moduleName = 'metricsApp';

angular
  .module(moduleName, [ovhManagerCore, ovhManagerMetrics, uiRouter])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/metrics'),
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
