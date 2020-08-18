<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import <%= pascalcasedName %> from '@ovh-ux/manager-<%= name %>';

Environment.setVersion(__VERSION__);

const moduleName = '<%= pascalcasedName %>App';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    <%= pascalcasedName %>
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
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
