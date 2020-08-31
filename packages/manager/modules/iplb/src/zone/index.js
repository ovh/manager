import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerZoneAddCtrl from './iplb-zone-add.controller';
import IpLoadBalancerZoneDeleteCtrl from './iplb-zone-delete.controller';
import IpLoadBalancerZoneAddService from './iplb-zone-add.service';
import IpLoadBalancerZoneDeleteService from './iplb-zone-delete.service';
import IplbZonePicker from './iplb-zone-picker.component';
import IplbOrderByHashFilter from './order-by-hash-key.filter';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbZoneAddTemplate from './iplb-zone-add.html';
import IplbZoneDeleteTemplate from './iplb-zone-delete.html';

const moduleName = 'ovhManagerIplbZone';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.zone', {
          url: '/zone',
          views: {
            iplbHeader: {
              template: IplbHeaderTemplate,
              controller: 'IpLoadBalancerDashboardHeaderCtrl',
              controllerAs: 'ctrl',
            },
            iplbContent: {
              template: `
                          <div data-ui-view="iplbZone"></div>
                      `,
            },
          },
          abstract: true,
          translations: {
            value: ['../../common', '..'],
            format: 'json',
          },
        })
        .state('iplb.detail.zone.add', {
          url: '/add',
          views: {
            iplbZone: {
              template: IplbZoneAddTemplate,
              controller: 'IpLoadBalancerZoneAddCtrl',
              controllerAs: '$ctrl',
            },
          },
          translations: {
            value: ['../../common', '..'],
            format: 'json',
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_zone_add_title'),
          },
        })
        .state('iplb.detail.zone.delete', {
          url: '/delete',
          views: {
            iplbZone: {
              template: IplbZoneDeleteTemplate,
              controller: 'IpLoadBalancerZoneDeleteCtrl',
              controllerAs: '$ctrl',
            },
          },
          translations: {
            value: ['../../common', '..'],
            format: 'json',
          },
        });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerZoneAddCtrl', IpLoadBalancerZoneAddCtrl)
  .controller('IpLoadBalancerZoneDeleteCtrl', IpLoadBalancerZoneDeleteCtrl)
  .service('IpLoadBalancerZoneAddService', IpLoadBalancerZoneAddService)
  .service('IpLoadBalancerZoneDeleteService', IpLoadBalancerZoneDeleteService)
  .component('iplbZonePicker', IplbZonePicker)
  .filter('orderHashByKey', IplbOrderByHashFilter)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
