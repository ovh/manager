import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

import component from './freefaxes.component';
import freefax from './freefax';

const moduleName = 'ovhManagerFreeFaxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    freefax,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('freefaxes', {
      url: '/freefax',
      abstract: true,
    });

    $stateProvider.state('freefaxes.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      component: 'ovhManagerFreefaxes',
      params: ListLayoutHelper.stateParams,
      resolve: {
        apiPath: () => '/freefax',
        ...ListLayoutHelper.stateResolves,
        getFreefaxLink: /* @ngInject */ $state => fax => $state.href('freefaxes.freefax', { serviceName: fax.number }),
      },
    });
  })
  .component('ovhManagerFreefaxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
