import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerHomeCtrl from './iplb-home.controller';
import IpLoadBalancerHomeService from './iplb-home.service';
import IpLoadBalancerHomeStatusService from './iplb-home-status.service';
import IpLoadBalancerUpdateQuotaCtrl from './updateQuota/iplb-update-quota.controller';
import IplbBulletChartComponent from './bullet-chart.component';
import IpLoadBalancerTerminateCtrl from '../modal/terminate/terminate.controller';
import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbHomeTemplate from './iplb-home.html';

import './bullet-chart.less';
import './status-card.less';
import './home.less';

import { LB_DELETE_FEATURE } from './iplb-home.constants';

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
          isDeleteOptionsAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
            return ovhFeatureFlipping
              .checkFeatureAvailability([LB_DELETE_FEATURE])
              .then((featureAvailability) =>
                featureAvailability.isFeatureAvailable(LB_DELETE_FEATURE),
              )
              .catch(() => false);
          },
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
  .controller('IpLoadBalancerTerminateCtrl', IpLoadBalancerTerminateCtrl)
  .directive('iplbBulletChart', IplbBulletChartComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
