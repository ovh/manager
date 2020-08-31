import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerGraphCtrl from './iplb-graph.controller';

import IplbGraphTemplate from './iplb-graph.html';
import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

const moduleName = 'ovhManagerIplbGraph';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('iplb.detail.graph', {
        url: '/graph',
        views: {
          iplbHeader: {
            template: IplbHeaderTemplate,
            controller: 'IpLoadBalancerDashboardHeaderCtrl',
            controllerAs: 'ctrl',
          },
          iplbContent: {
            template: IplbGraphTemplate,
            controller: 'IpLoadBalancerGraphCtrl',
            controllerAs: 'ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('iplb_graph_title'),
        },
      });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerGraphCtrl', IpLoadBalancerGraphCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
