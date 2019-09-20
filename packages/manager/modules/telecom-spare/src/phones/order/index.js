import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-angular-contact';

import './phones-order.scss';

const moduleName = 'ovhManagerSpareOrderPhoneLazyLoading';

angular
  .module(moduleName, [
    'ovh-angular-contact',
    'ui.router',
    'oc.lazyLoad',
    'ui.select',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('spare.phones.order.**', {
      url: '/order',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./phones-order.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
