import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import 'script-loader!chart.js/dist/Chart.min.js'; // eslint-disable-line
import 'script-loader!angular-websocket/dist/angular-websocket'; // eslint-disable-line
import 'script-loader!bootstrap/dist/js/bootstrap'; // eslint-disable-line

import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import DbaasLogs from '@ovh-ux/manager-dbaas-logs';

Environment.setVersion(__VERSION__);

const moduleName = 'DbaasLogsApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    DbaasLogs,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/dbaas/logs'),
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
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
  );

export default moduleName;
