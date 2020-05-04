import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import bandwidth from './bandwidth/bandwidth.module';
import interfaces from './interfaces/interfaces.module';
import monitoring from './monitoring';
import servers from './servers/servers.module';

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
    interfaces,
    monitoring,
    'oui',
    'pascalprecht.translate',
    servers,
    'ui.router',
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
  .constant('NEW_RANGE', {
    PATTERN: /^(ADV|STOR|ADVANCE|RISE|INFRA)-[1-9]$/,
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
