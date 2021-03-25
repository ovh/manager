import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import ovhManagerCda from '@ovh-ux/manager-cda';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

const moduleName = 'cdaApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhCloudUniverseComponents,
    ngUiRouterBreadcrumb,
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
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
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
