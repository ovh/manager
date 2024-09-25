import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerFrontendsCtrl from './iplb-frontends.controller';
import IpLoadBalancerFrontendDeleteCtrl from './delete/iplb-frontends-delete.controller';
import IpLoadBalancerFrontendsEditCtrl from './iplb-frontends-edit.controller';
import IpLoadBalancerFrontendPreviewCtrl from './preview/iplb-frontends-preview.controller';
import IpLoadBalancerFrontendsService from './iplb-frontends.service';

import IplbFrontendsEditTemplate from './iplb-frontends-edit.html';
import IplbFrontendsTemplate from './iplb-frontends.html';
import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

const moduleName = 'ovhManagerIplbFrontends';
const LB_FRONTEND_UDP_AVAILABILITY = 'ip-load-balancer:lb-frontend-udp';

angular
  .module(moduleName, ['ui.router', ngOvhFeatureFlipping])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.frontends', {
          url: '/frontends',
          redirectTo: 'iplb.detail.frontends.home',
          views: {
            iplbHeader: {
              template: IplbHeaderTemplate,
              controller: 'IpLoadBalancerDashboardHeaderCtrl',
              controllerAs: 'ctrl',
            },
            iplbContent: {
              template: '<div data-ui-view="iplbFrontend"><div>',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_frontends_title'),
          },
        })
        .state('iplb.detail.frontends.home', {
          url: '',
          views: {
            iplbFrontend: {
              template: IplbFrontendsTemplate,
              controller: 'IpLoadBalancerFrontendsCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: () => null,
          },
        })
        .state('iplb.detail.frontends.add', {
          url: '/add',
          views: {
            iplbFrontend: {
              template: IplbFrontendsEditTemplate,
              controller: 'IpLoadBalancerFrontendsEditCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_frontends_add'),
            udpAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
              ovhFeatureFlipping
                .checkFeatureAvailability(LB_FRONTEND_UDP_AVAILABILITY)
                .then((feature) =>
                  feature.isFeatureAvailable(LB_FRONTEND_UDP_AVAILABILITY),
                ),
          },
        })
        .state('iplb.detail.frontends.update', {
          url: '/:frontendId',
          views: {
            iplbFrontend: {
              template: IplbFrontendsEditTemplate,
              controller: 'IpLoadBalancerFrontendsEditCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            frontendId: /* @ngInject */ ($transition$) =>
              $transition$.params().frontendId,
            breadcrumb: /* @ngInject */ (frontendId) => frontendId,
            udpAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
              ovhFeatureFlipping
                .checkFeatureAvailability(LB_FRONTEND_UDP_AVAILABILITY)
                .then((feature) =>
                  feature.isFeatureAvailable(LB_FRONTEND_UDP_AVAILABILITY),
                ),
          },
        });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller('IpLoadBalancerFrontendsCtrl', IpLoadBalancerFrontendsCtrl)
  .controller(
    'IpLoadBalancerFrontendsEditCtrl',
    IpLoadBalancerFrontendsEditCtrl,
  )
  .controller(
    'IpLoadBalancerFrontendPreviewCtrl',
    IpLoadBalancerFrontendPreviewCtrl,
  )
  .controller(
    'IpLoadBalancerFrontendDeleteCtrl',
    IpLoadBalancerFrontendDeleteCtrl,
  )
  .service('IpLoadBalancerFrontendsService', IpLoadBalancerFrontendsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
