import angular from 'angular';

import component from './command.component';
import routing from './command.routing';
import orderReview from '../../components/order-review';
import pciOrderCommandTerraform from '../../../../../../components/pci-order-command-terraform';
import '@ovh-ux/ui-kit';

const moduleName = 'ovhManagerPciStoragesDatabasesAddCommand';

angular
  .module(moduleName, ['oui', orderReview, pciOrderCommandTerraform])
  .config(routing)
  .component('ovhManagerPciProjectDatabasesAddCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
