import angular from 'angular';

import component from './delete-token.component';
import routing from './delete-token.routing';

const moduleName = 'pciProjectAiDashboardDeleteTokenModal';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectAiDashboardDeleteTokenModalComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
