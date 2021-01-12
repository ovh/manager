import 'script-loader!jquery'; // eslint-disable-line
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import ovhManagerCda from '@ovh-ux/manager-cda';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

const moduleName = 'cdaApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhCloudUniverseComponents,
    ovhManagerCda,
  ])
  .config(
    /* @ngInject */ (CucConfigProvider) => {
      CucConfigProvider.setRegion(Environment.getRegion());
    },
  )
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/cda'),
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
