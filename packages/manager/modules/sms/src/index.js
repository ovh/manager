import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'oclazyload';

import { ListLayoutHelper } from '@ovh-ux/ng-ovh-telecom-universe-components';

import sms from './sms';
import component from './sms.component';

const moduleName = 'ovhManagerSms';


angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
  'ovhManagerCore',
  sms,
])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('sms', {
      url: '/sms',
      abstract: true,
    });


    $stateProvider.state('sms.index', {
      url: `?${ListLayoutHelper.urlQueryParams}`,
      views: {
        '': {
          component: 'ovhManagerSms',
        },
      },
      params: ListLayoutHelper.stateParams,
      resolve: {
        apiPath: () => '/sms',
        ...ListLayoutHelper.stateResolves,
        getSmsLink: /* @ngInject */ $state => ({ name }) => $state.href(
          'sms.service',
          {
            serviceName: name,
          },
        ),
      },
    });
  })
  .component('ovhManagerSms', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
