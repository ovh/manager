import angular from 'angular';
import '@uirouter/angularjs';

import IpLoadBalancerDashboardHeaderCtrl from '../header/iplb-dashboard-header.controller';
import IpLoadBalancerSslCertificateService from './iplb-ssl-certificate.service';

import OvhManagerIplbSSLcertificatesDelete from './delete';
import OvhManagerIplbSSLcertificatesEdit from './edit';
import OvhManagerIplbSSLcertificatesOrder from './order';
import OvhManagerIplbSSLcertificatesPreview from './preview';
import OvhManagerIplbSSLcertificatesUpdate from './update';

import iplbSSLcertificatesComponent from './iplb-ssl-certificate.component';

import routing from './iplb-ssl-certificate.routing';

const moduleName = 'ovhManagerIplbSSLcertificates';

angular
  .module(moduleName, [
    'ui.router',
    OvhManagerIplbSSLcertificatesDelete,
    OvhManagerIplbSSLcertificatesEdit,
    OvhManagerIplbSSLcertificatesOrder,
    OvhManagerIplbSSLcertificatesPreview,
    OvhManagerIplbSSLcertificatesUpdate,
  ])
  .config(routing)
  .component('iplbSSLcertificatesComponent', iplbSSLcertificatesComponent)
  .controller('IpLoadBalancerDashboardHeaderCtrl', IpLoadBalancerDashboardHeaderCtrl)
  .service('IpLoadBalancerSslCertificateService', IpLoadBalancerSslCertificateService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
