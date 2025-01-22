import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import './result.scss';

const moduleName = 'ovhCloudConnectDiagnosticsResultLazyLoading';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('cloud-connect.details.diagnostics.result.**', {
        url: '/diagnostics/:diagnosticId/result',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./result.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
