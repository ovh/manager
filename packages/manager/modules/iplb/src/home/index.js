import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerHomeCtrl from './iplb-home.controller';
import IpLoadBalancerHomeService from './iplb-home.service';
import IpLoadBalancerHomeStatusService from './iplb-home-status.service';
import IpLoadBalancerUpdateQuotaCtrl from './updateQuota/iplb-update-quota.controller';
import IplbBulletChartComponent from './bullet-chart.component';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbHomeTemplate from './iplb-home.html';

import './bullet-chart.less';
import './status-card.less';
import './home.less';

const moduleName = 'ovhManagerIplbHome';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('iplb.detail.home', {
        url: '/home',
        views: {
          iplbHeader: {
            template: IplbHeaderTemplate,
            controller: 'IpLoadBalancerDashboardHeaderCtrl',
            controllerAs: 'ctrl',
          },
          iplbContent: {
            template: IplbHomeTemplate,
            controller: 'IpLoadBalancerHomeCtrl',
            controllerAs: '$ctrl',
          },
        },
        translations: {
          value: ['../zone', '../vrack'],
          format: 'json',
        },
        resolve: {
          breadcrumb: () => null,
        },
      });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .service('IpLoadBalancerHomeService', IpLoadBalancerHomeService)
  .controller('IpLoadBalancerHomeCtrl', IpLoadBalancerHomeCtrl)
  .service('IpLoadBalancerHomeStatusService', IpLoadBalancerHomeStatusService)
  .controller('IpLoadBalancerUpdateQuotaCtrl', IpLoadBalancerUpdateQuotaCtrl)
  .directive('iplbBulletChart', IplbBulletChartComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
