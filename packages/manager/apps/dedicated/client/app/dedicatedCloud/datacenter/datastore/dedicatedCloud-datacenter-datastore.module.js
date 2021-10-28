import angular from 'angular';

import datacenterDatastoreComponent from '../../../components/dedicated-cloud/datacenter/datastore';
import order from './order';
import orderLegacy from './orderLegacy';
import resourceUpgrade from './resource-upgrade/upgrade';
import resourceUpgradeLegacy from './resource-upgrade/upgradeLegacy';
import convertToGlobal from './convert-to-global';
import routing from './dedicatedCloud-datacenter-datastore.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDatastore';

angular
  .module(moduleName, [
    convertToGlobal,
    datacenterDatastoreComponent,
    order,
    orderLegacy,
    resourceUpgrade,
    resourceUpgradeLegacy,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
