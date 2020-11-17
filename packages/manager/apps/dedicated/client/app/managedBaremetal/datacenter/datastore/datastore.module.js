import angular from 'angular';

import datacenterDatastoreComponent from '../../../components/dedicated-cloud/datacenter/datastore';
import order from './order';
import orderLegacy from './orderLegacy';
import resourceUpgrade from './resource-upgrade/upgrade';
import resourceUpgradeLegacy from './resource-upgrade/upgradeLegacy';
import routing from './datastore.routes';

const moduleName = 'managedBaremetalDatacenterDatastore';

angular
  .module(moduleName, [
    datacenterDatastoreComponent,
    order,
    orderLegacy,
    resourceUpgrade,
    resourceUpgradeLegacy,
  ])
  .config(routing);

export default moduleName;
