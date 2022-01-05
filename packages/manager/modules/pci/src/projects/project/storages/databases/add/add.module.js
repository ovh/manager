import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './add.component';
import enginesList from '../components/engines-list';
import flavorBilling from '../../../../../components/project/flavor-billing';
import flavorsList from '../components/flavors-list';
import labs from '../../../../../components/project/labs';
import orderCommand from '../components/order-command';
import orderReview from '../components/order-review';
import plansList from '../components/plans-list';
import regionsList from '../../../../../components/project/regions-list';
import inputRule from '../components/input-rule';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    enginesList,
    flavorBilling,
    flavorsList,
    labs,
    orderCommand,
    orderReview,
    plansList,
    regionsList,
    inputRule,
  ])
  .config(routing)
  .component('pciProjectStoragesDatabasesAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
