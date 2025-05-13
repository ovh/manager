import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerSslCertificateCtrl from './iplb-ssl-certificate.controller';
import IpLoadBalancerSslCertificateDeleteCtrl from './delete/iplb-ssl-certificate-delete.controller';
import IpLoadBalancerSslCertificateEditCtrl from './iplb-ssl-certificate-edit.controller';
import IpLoadBalancerSslCertificateOrderCtrl from './order/iplb-ssl-certificate-order.controller';
import IpLoadBalancerSslCertificatePreviewCtrl from './preview/iplb-ssl-certificate-preview.controller';
import IpLoadBalancerSslCertificateService from './iplb-ssl-certificate.service';
import IpLoadBalancerSslCertificateUpdateCtrl from './update/iplb-ssl-certificate-update.controller';

import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';
import IplbEditSSLcertificateTemplate from './iplb-ssl-certificate-edit.html';
import IplbOrderSSLcertificateTemplate from './order/iplb-ssl-certificate-order.html';
import IplbSSLcertificateTemplate from './iplb-ssl-certificate.html';

const moduleName = 'ovhManagerIplbSSLcertificates';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider
        .state('iplb.detail.ssl-certificate', {
          url: '/sslCertificate',
          redirectTo: 'iplb.detail.ssl-certificate.home',
          views: {
            iplbHeader: {
              template: IplbHeaderTemplate,
              controller: 'IpLoadBalancerDashboardHeaderCtrl',
              controllerAs: 'ctrl',
            },
            iplbContent: {
              template: '<div data-ui-view="iplbSslCertificate"><div>',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_ssl_certificate_title'),
          },
        })
        .state('iplb.detail.ssl-certificate.home', {
          url: '',
          views: {
            iplbSslCertificate: {
              template: IplbSSLcertificateTemplate,
              controller: 'IpLoadBalancerSslCertificateCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: () => null,
          },
        })
        .state('iplb.detail.ssl-certificate.add', {
          url: '/add',
          views: {
            iplbSslCertificate: {
              template: IplbEditSSLcertificateTemplate,
              controller: 'IpLoadBalancerSslCertificateEditCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_ssl_certificate_add'),
          },
        })
        .state('iplb.detail.ssl-certificate.order', {
          url: '/order',
          views: {
            iplbSslCertificate: {
              template: IplbOrderSSLcertificateTemplate,
              controller: 'IpLoadBalancerSslCertificateOrderCtrl',
              controllerAs: 'ctrl',
            },
          },
          resolve: {
            breadcrumb: /* @ngInject */ ($translate) =>
              $translate.instant('iplb_ssl_order_title'),
          },
        });
    },
  )
  .controller(
    'IpLoadBalancerDashboardHeaderCtrl',
    IpLoadBalancerDashboardHeaderCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificateCtrl',
    IpLoadBalancerSslCertificateCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificateEditCtrl',
    IpLoadBalancerSslCertificateEditCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificateUpdateCtrl',
    IpLoadBalancerSslCertificateUpdateCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificatePreviewCtrl',
    IpLoadBalancerSslCertificatePreviewCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificateOrderCtrl',
    IpLoadBalancerSslCertificateOrderCtrl,
  )
  .controller(
    'IpLoadBalancerSslCertificateDeleteCtrl',
    IpLoadBalancerSslCertificateDeleteCtrl,
  )
  .service(
    'IpLoadBalancerSslCertificateService',
    IpLoadBalancerSslCertificateService,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
