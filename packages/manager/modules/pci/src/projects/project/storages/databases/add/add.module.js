import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ui-kit';

import component from './add.component';
import enginesList from '../components/engines-list';
import flavorBilling from '../../../../../components/project/flavor-billing';
import flavorsList from '../components/flavors-list';
import orderReview from '../components/order-review';
import plansList from '../components/plans-list';
import regionsList from '../../../../../components/project/regions-list';
import inputRule from '../components/input-rule';
import diskSizeComponent from '../components/disk-size';
import switchPriceComponent from '../components/switch-price';
import routing from './add.routing';
import activateProjectBanner from '../../../components/activate-project-banner';

import command from './command';

const moduleName = 'ovhManagerPciStoragesDatabasesAdd';

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
    command,
    diskSizeComponent,
    switchPriceComponent,
    activateProjectBanner,
  ])
  .config(routing)
  .component('pciProjectStoragesDatabasesAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
