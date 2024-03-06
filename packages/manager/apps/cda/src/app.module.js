import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import { isString, get } from 'lodash-es';

import ovhManagerCda from '@ovh-ux/manager-cda';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import './index.scss';

export default (containerEl, environment) => {
  const moduleName = 'cdaApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngAtInternet,
        ngOvhCloudUniverseComponents,
        ngUiRouterBreadcrumb,
        ovhManagerCda,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ (CucConfigProvider) => {
        CucConfigProvider.setRegion(environment.getRegion());
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
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
