import angular from 'angular';

import datacenterHostComponent from '../../../components/dedicated-cloud/datacenter/host';
import order from './order';
import orderLegacy from './orderLegacy';
import resourceUpgrade from './resource-upgrade/upgrade';
import resourceUpgradeLegacy from './resource-upgrade/upgradeLegacy';
import routing from './dedicatedCloud-datacenter-host.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHost';

angular
  .module(moduleName, [
    datacenterHostComponent,
    order,
    orderLegacy,
    resourceUpgrade,
    resourceUpgradeLegacy,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
