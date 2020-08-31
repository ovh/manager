import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerConfigurationCtrl from './iplb-configuration.controller';
import IpLoadBalancerConfigurationService from './iplb-configuration.service';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbConfigurationTemplate from './iplb-configuration.html';

const moduleName = 'ovhManagerIplbConfiguration';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('iplb.detail.configuration', {
        url: '/configuration',
        views: {
          iplbHeader: {
            template: IplbHeaderTemplate,
            controller: 'IpLoadBalancerDashboardHeaderCtrl',
            controllerAs: 'ctrl',
          },
          iplbContent: {
            template: IplbConfigurationTemplate,
            controller: 'IpLoadBalancerConfigurationCtrl',
            controllerAs: '$ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller(
    'IpLoadBalancerConfigurationCtrl',
    IpLoadBalancerConfigurationCtrl,
  )
  .service(
    'IpLoadBalancerConfigurationService',
    IpLoadBalancerConfigurationService,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
