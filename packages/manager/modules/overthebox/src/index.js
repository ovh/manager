import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/manager-core';

import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

import overTheBox from './overthebox';

import component from './overtheboxes.component';

const moduleName = 'ovhManagerOverTheBoxes';

angular
  .module(moduleName, [
    'ui.router',
    'ovhManagerCore',
    'oc.lazyLoad',
    overTheBox,
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('overTheBoxes', {
      url: '/overTheBox',
      abstract: true,
    });

    $stateProvider.state('overTheBoxes.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      component: 'ovhManagerOverTheBoxes',
      params: ListLayoutHelper.stateParams,
      resolve: {
        apiPath: () => '/overTheBox',
        ...ListLayoutHelper.stateResolves,
        getOvertheboxLink: /* @ngInject */ $state => otb => $state.href('overTheBoxes.overTheBox.details', {
          serviceName: otb.serviceName,
        }),
      },
    });
  })
  .component('ovhManagerOverTheBoxes', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
