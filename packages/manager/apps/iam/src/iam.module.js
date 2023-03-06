import 'script-loader!moment'; // eslint-disable-line

import angular from 'angular';

import ovhManagerIAM from '@ovh-ux/manager-iam';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import { registerCoreModule } from '@ovh-ux/manager-core';

import './iam.styles.scss';

const redirection = /* @ngInject */ ($urlRouterProvider) => {
  $urlRouterProvider.otherwise('/iam');
};

const importMomentLocale = /* @ngInject */ ($translate) => {
  const locale = $translate.use();
  const fixedLocale = ['en_GB', 'es_US', 'fr_CA'].includes(locale)
    ? locale.toLowerCase().replace('_', '-')
    : locale.split('_')[0];

  return import(`script-loader!moment/locale/${fixedLocale}.js`).then(() =>
    moment.locale(fixedLocale),
  );
};

const broadcastAppStarted = /* @ngInject */ ($rootScope, $transitions) => {
  const unregisterHook = $transitions.onSuccess({}, () => {
    $rootScope.$broadcast('app:started');
    unregisterHook();
  });
};

export default (element, environment) => {
  const moduleName = 'ovhManagerIAMApp';
  angular
    .module(moduleName, [
      ovhManagerIAM,
      ngUiRouterBreadcrumb,
      registerCoreModule(environment),
    ])
    .config(redirection)
    .run(importMomentLocale)
    .run(broadcastAppStarted);

  angular.bootstrap(element, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
