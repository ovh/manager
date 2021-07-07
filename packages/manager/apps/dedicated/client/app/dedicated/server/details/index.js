import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';

import bandwidth from '../bandwidth/bandwidth.module';
import dashboard from '../dashboard';
import install from '../install';
import interfaces from '../interfaces/interfaces.module';
import monitoring from '../monitoring';
import tasks from '../tasks';

import bandwidthVrackOrderService from './server.bandwidth-vrack-order.service';
import component from './server.component';
import featureAvailability from './server.feature-availability';
import routing from './server.routing';
import service from './server.service';

import './server.less';

const moduleName = 'ovhManagerDedicatedServer';

angular
  .module(moduleName, [
    bandwidth,
    dashboard,
    install,
    interfaces,
    monitoring,
    'oui',
    ovhManagerIncidentBanner,
    'pascalprecht.translate',
    tasks,
    'ui.router',
    interventions,
    ipmi,
    orderKvm,
    netboot,
  ])
  .component('dedicatedServer', component)
  .config(routing)
  .service('Server', service)
  .service('BandwidthVrackOrderService', bandwidthVrackOrderService)
  .service('DedicatedServerFeatureAvailability', featureAvailability)
  .constant('FIREWALL_RULE_ACTIONS', {
    ALLOW: 'PERMIT',
    DENY: 'DENY',
  })
  .constant('FIREWALL_RULE_PROTOCOLS', {
    IPV_4: 'IPv4',
    UDP: 'UDP',
    TCP: 'TCP',
    ICMP: 'ICMP',
  })
  .constant('FIREWALL_STATUSES', {
    ACTIVATED: 'ACTIVATED',
    DEACTIVATED: 'DEACTIVATED',
    NOT_CONFIGURED: 'NOT_CONFIGURED',
  })
  .constant('MITIGATION_STATUSES', {
    ACTIVATED: 'ACTIVATED',
    AUTO: 'AUTO',
    FORCED: 'FORCED',
  })
  .constant('STATISTICS_SCALE', {
    TENSECS: '_10_S',
    ONEMIN: '_1_M',
    FIVEMINS: '_5_M',
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
