import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line

import { isString, get } from 'lodash-es';

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import * as dateFnsLocales from 'date-fns/locale';

import Office from '@ovh-ux/manager-office';

const getDateFnsLocale = (language) => {
  if (language === 'en_GB') {
    return 'enGB';
  }
  if (language === 'fr_CA') {
    return 'frCA';
  }
  const [locale] = language.split('_');
  return locale;
};

export default (containerEl, environment) => {
  const moduleName = 'OfficeApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngAtInternet,
        ngOvhChart,
        ngUiRouterBreadcrumb,
        uiRouter,
        Office,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/configuration/microsoft/office/license'),
    )
    .config(
      /* @ngInject */ ($stateProvider) => {
        $stateProvider.state('app', {
          abstract: true,
          template: '<div ui-view></div>',
        });
        $stateProvider.state('app.microsoft', {
          abstract: true,
          template: '<div ui-view></div>',
        });
      },
    )
    .constant(
      'DATEFNS_LOCALE',
      dateFnsLocales[getDateFnsLocale(environment.userLocale)],
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
