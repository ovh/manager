import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line

import { isString, get } from 'lodash-es';

import angular from 'angular';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerOtb from '@ovh-ux/manager-overthebox';
import * as dateFnsLocales from 'date-fns/locale';

import 'ovh-manager-webfont/dist/css/ovh-font.css';

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
  const moduleName = 'overtheboxApp';
  angular
    .module(
      'overtheboxApp',
      [
        ngAtInternet,
        ngOvhApiWrappers,
        ngOvhChart,
        ngUiRouterBreadcrumb,
        ovhManagerOtb,
        registerCoreModule(environment),
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/overTheBox'),
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
    strictDi: false,
  });

  return moduleName;
};
