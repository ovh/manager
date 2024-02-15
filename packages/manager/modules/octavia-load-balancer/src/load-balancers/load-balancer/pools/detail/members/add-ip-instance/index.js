import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import './style.less';

const moduleName =
  'ovhManagerOctaviaLoadBalancerDashboardPoolsDetailMembersAddIpInstanceLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'octavia-load-balancer.loadbalancer.pools.detail.members.list.add-ip-instance.**',
      {
        url: '/add-ip-instance',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
