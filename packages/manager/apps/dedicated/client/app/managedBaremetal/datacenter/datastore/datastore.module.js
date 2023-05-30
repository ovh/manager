import angular from 'angular';

import datacenterDatastoreComponent from '../../../components/dedicated-cloud/datacenter/datastore';
import order from './order';
import orderLegacy from './orderLegacy';
import resourceUpgrade from './resource-upgrade/upgrade';
import resourceUpgradeLegacy from './resource-upgrade/upgradeLegacy';
import routing from './datastore.routes';
import convertToGlobal from './convert-to-global';

const moduleName = 'managedBaremetalDatacenterDatastore';

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
