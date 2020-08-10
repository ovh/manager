import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Emailpro from '@ovh-ux/manager-emailpro';

Environment.setVersion(__VERSION__);

const moduleName = 'emailproApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    Emailpro,
    uiRouter,
  ])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/configuration/email_pro'),
  )
  .config(
    /* @ngInject */ ($stateProvider) =>
      $stateProvider.state('app', {
        url: '',
        abstract: true,
      }),
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
