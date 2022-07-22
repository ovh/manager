import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './fork.component';
import enginesList from '../components/engines-list';
import flavorBilling from '../../../../../components/project/flavor-billing';
import flavorsList from '../components/flavors-list';
import orderReview from '../components/order-review';
import plansList from '../components/plans-list';
import regionsList from '../../../../../components/project/regions-list';
import inputRule from '../components/input-rule';
import diskSize from '../components/disk-size';
import routing from './fork.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesFork';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'oui',
    'ovhManagerPciComponents',
    enginesList,
    flavorBilling,
    flavorsList,
    orderReview,
    plansList,
    regionsList,
    inputRule,
    diskSize,
  ])
  .config(routing)
  .component('pciProjectStoragesDatabasesFork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
