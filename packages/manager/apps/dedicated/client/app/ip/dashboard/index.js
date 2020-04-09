import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import antihack from './antihack';
import arp from './arp';
import block from './block';
import exportCsv from './export-csv';
import firewallToggle from './firewall-toggle';
import migration from './migration';
import mitigation from './mitigation';
import order from './order';
import orderLegacy from './order-legacy';
import organisation from './organisation';
import reverse from './reverse';
import virtualMac from './virtual-mac';

import component from './dashboard.component';
import routing from './dashboard.routing';
import service from './dashboard.service';

const moduleName = 'ovhManagerDedicatedIpDashboard';

angular
  .module(moduleName, [
    antihack,
    arp,
    block,
    exportCsv,
    firewallToggle,
    migration,
    mitigation,
    order,
    orderLegacy,
    organisation,
    'oui',
    'pascalprecht.translate',
    reverse,
    'ui.router',
    virtualMac,
  ])
  .component('ipDashboard', component)
  .service('Ip', service)
  .config(routing);

export default moduleName;
