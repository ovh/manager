import angular from 'angular';

import datacenterHostComponent from '../../../components/dedicated-cloud/datacenter/host';
import order from './order';
import orderLegacy from './orderLegacy';
import resourceUpgrade from './resource-upgrade/upgrade';
import resourceUpgradeLegacy from './resource-upgrade/upgradeLegacy';
import routing from './host.routes';

const moduleName = 'managedBaremetalDatacenterHost';

angular
  .module(moduleName, [
    datacenterHostComponent,
    order,
    orderLegacy,
    resourceUpgrade,
    resourceUpgradeLegacy,
  ])
  .config(routing);

export default moduleName;
