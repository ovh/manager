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

import { LB_DELETE_FEATURE, SERVICE_TYPE } from './iplb-home.constants';

const moduleName = 'ovhManagerIplbHome';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.home', {
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
        })
        .state('iplb.detail.home.terminate', {
          url: '/terminate/:id',
          views: {
            modal: {
              component: 'billingAutorenewTerminateAgoraService',
            },
          },
          layout: 'modal',
          resolve: {
            breadcrumb: () => null,
            serviceType: () => SERVICE_TYPE,
            subscriptionInfo: /* @ngInject */ (
              $transition$,
              IpLoadBalancerService,
            ) =>
              IpLoadBalancerService.getSubscription($transition$.params().id),
            id: /* @ngInject */ (subscriptionInfo) =>
              subscriptionInfo.serviceId,
            goBack: /* @ngInject */ ($state, Alerter) => (message, type) => {
              const promise = $state.go('iplb.detail.home');
              if (message) {
                if (type === 'danger') Alerter.error(message, 'InfoErrors');
                else Alerter.success(message, 'InfoErrors');
              }
              return promise;
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
  .directive('iplbBulletChart', IplbBulletChartComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
