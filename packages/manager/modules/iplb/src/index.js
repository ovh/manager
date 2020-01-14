import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-layout';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';
import 'angular-chart.js';
import '@ovh-ux/ng-ovh-sidebar-menu';

import ovhManagerCore from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!chart.js/dist/Chart.js';
import 'script-loader!angular-chart.js/dist/angular-chart.js';
/* eslint-enable import/no-webpack-loader-syntax */

import IpLoadBalancerCipherService from './iplb-cipher.service';
import IpLoadBalancerConstant from './iplb.constants';
import IpLoadBalancerDetailCtrl from './iplb-detail.controller';
import IpLoadBalancerFailoverIpService from './iplb-failover-ip.service';
import IpLoadBalancerMetricsService from './iplb-metrics.service';
import IpLoadBalancerNatIpService from './iplb-nat-ip.service';
import IpLoadBalancerZoneService from './iplb-zone.service';
import IplbConfigurationModule from './configuration';
import IplbFrontendsModule from './frontends';
import IplbGraphModule from './graph';
import IplbHomeModule from './home';
import IplbServerFormModule from './serverFarm';
import IplbSSLcertificateModule from './sslCertificate';
import IplbTaskModule from './task';
import IplbVrackModule from './vrack';
import IplbZoneModule from './zone';

import routing from './routing';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import './iplb.less';
import './iplb.scss';

const moduleName = 'ovhManagerIplb';

angular
  .module(moduleName, [
    'chart.js',
    'pascalprecht.translate',
    'ui.router',
    'ngUiRouterLayout',
    'ovh-api-services',
    'oui',
    'ui.bootstrap',
    'ngOvhSidebarMenu',
    ovhManagerCore,
    ngAtInternet,
    ngOvhDocUrl,
    ngOvhCloudUniverseComponents,
    IplbSSLcertificateModule,
    IplbTaskModule,
    IplbVrackModule,
    IplbZoneModule,
    IplbServerFormModule,
    IplbHomeModule,
    IplbGraphModule,
    IplbFrontendsModule,
    IplbConfigurationModule,
  ])
  .config(routing)
  .config(
    /* @ngInject */ (
      $qProvider,
      ovhDocUrlProvider,
      TranslateServiceProvider,
    ) => {
      ovhDocUrlProvider.setUserLocale(TranslateServiceProvider.getUserLocale());
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .controller('IpLoadBalancerDetailCtrl', IpLoadBalancerDetailCtrl)
  .service('IpLoadBalancerCipherService', IpLoadBalancerCipherService)
  .service('IpLoadBalancerFailoverIpService', IpLoadBalancerFailoverIpService)
  .service('IpLoadBalancerMetricsService', IpLoadBalancerMetricsService)
  .service('IpLoadBalancerNatIpService', IpLoadBalancerNatIpService)
  .service('IpLoadBalancerZoneService', IpLoadBalancerZoneService)
  .constant('IpLoadBalancerConstant', IpLoadBalancerConstant)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
