import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';

const moduleName =
  'ovhManagerDedicatedSupportTicketsModalBetaHelpcenterLazyLoading';

angular.module(moduleName, [oclazyload, uiRouter]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('support.tickets.beta-help-center.**', {
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./modal.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
      url: '/betaHelpCenter',
    });
  },
);

export default moduleName;
