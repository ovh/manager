import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerVrackEditCtrl from './iplb-vrack-edit.controller';
import IpLoadBalancerVrackCtrl from './iplb-vrack.controller';
import IpLoadBalancerVrackService from './iplb-vrack.service';
import IpLoadBalancerVrackHelper from './common/iplb-vrack-helper.service';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbVrackTemplate from './iplb-vrack.html';
import IplbVrackEditTemplate from './iplb-vrack-edit.html';

import './iplb-vrack.less';

const moduleName = 'ovhManagerIplbVrack';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.vrack', {
          url: '/vrack',
          redirectTo: 'iplb.detail.vrack.home',
          views: {
            iplbHeader: {
              template: IplbHeaderTemplate,
              controller: 'IpLoadBalancerDashboardHeaderCtrl',
              controllerAs: 'ctrl',
            },
            iplbContent: {
              template: '<div data-ui-view="iplbVrack"><div>',
            },
          },
          translations: {
            value: ['../frontends'],
            format: 'json',
          },
        })
        .state('iplb.detail.vrack.home', {
          url: '/',
          views: {
            iplbVrack: {
              template: IplbVrackTemplate,
              controller: 'IpLoadBalancerVrackCtrl',
              controllerAs: '$ctrl',
            },
          },
          translations: {
            value: ['../vrack'],
            format: 'json',
          },
        })
        .state('iplb.detail.vrack.add', {
          url: '/add',
          views: {
            iplbVrack: {
              template: IplbVrackEditTemplate,
              controller: 'IpLoadBalancerVrackEditCtrl',
              controllerAs: '$ctrl',
            },
          },
          translations: {
            value: ['../frontends'],
            format: 'json',
          },
        })
        .state('iplb.detail.vrack.edit', {
          url: '/:networkId',
          views: {
            iplbVrack: {
              template: IplbVrackEditTemplate,
              controller: 'IpLoadBalancerVrackEditCtrl',
              controllerAs: '$ctrl',
            },
          },
          translations: {
            value: ['../frontends'],
            format: 'json',
          },
        });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerVrackEditCtrl', IpLoadBalancerVrackEditCtrl)
  .controller('IpLoadBalancerVrackCtrl', IpLoadBalancerVrackCtrl)
  .service('IpLoadBalancerVrackService', IpLoadBalancerVrackService)
  .service('IpLoadBalancerVrackHelper', IpLoadBalancerVrackHelper)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
