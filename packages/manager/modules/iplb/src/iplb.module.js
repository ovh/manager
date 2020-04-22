import angular from 'angular';
import '@uirouter/angularjs';
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

import IpLoadBalancerActionService from './iplb-action.service';
import IpLoadBalancerCipherService from './iplb-cipher.service';
import IpLoadBalancerConstant from './iplb.constants';
import IpLoadBalancerDetailCtrl from './iplb-detail.controller';
import IpLoadBalancerFailoverIpService from './iplb-failover-ip.service';
import IpLoadBalancerMetricsService from './iplb-metrics.service';
import IpLoadBalancerNatIpService from './iplb-nat-ip.service';
import IpLoadBalancerZoneService from './iplb-zone.service';
import IpLoadBalancerNatIpDetailCtrl from './modal/nat-ip/iplb-nat-ip-detail.controller';
import IpLoadBalancerFailoverIpDetailCtrl from './modal/failover-ip/iplb-failover-ip-detail.controller';
import IpLoadBalancerCipherChangeCtrl from './modal/cipher/iplb-cipher-change.controller';
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
import 'ovh-ui-kit/dist/oui-olt.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';
import './iplb.less';
import './iplb.scss';

const moduleName = 'ovhManagerIplb';

angular
  .module(moduleName, [
    'chart.js',
    'pascalprecht.translate',
    'ui.router',
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
  .service('IpLoadBalancerActionService', IpLoadBalancerActionService)
  .service('IpLoadBalancerCipherService', IpLoadBalancerCipherService)
  .service('IpLoadBalancerFailoverIpService', IpLoadBalancerFailoverIpService)
  .service('IpLoadBalancerMetricsService', IpLoadBalancerMetricsService)
  .service('IpLoadBalancerNatIpService', IpLoadBalancerNatIpService)
  .service('IpLoadBalancerZoneService', IpLoadBalancerZoneService)
  .constant('IpLoadBalancerConstant', IpLoadBalancerConstant)
  .controller('IpLoadBalancerNatIpDetailCtrl', IpLoadBalancerNatIpDetailCtrl)
  .controller(
    'IpLoadBalancerFailoverIpDetailCtrl',
    IpLoadBalancerFailoverIpDetailCtrl,
  )
  .controller('IpLoadBalancerCipherChangeCtrl', IpLoadBalancerCipherChangeCtrl)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
