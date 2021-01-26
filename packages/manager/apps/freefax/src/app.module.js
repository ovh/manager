import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import uiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

const moduleName = 'freefaxApp';

angular
  .module(moduleName, [ngOvhApiWrappers, ovhManagerFreeFax, uiRouterBreadcrumb])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/freefax'),
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        $rootScope.$broadcast('app:started');
        unregisterHook();
      });
    },
  );

export default moduleName;
