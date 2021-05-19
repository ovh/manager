import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciNotebooksAdd';

angular
  .module(moduleName, ['ngOvhCloudUniverseComponents', 'oui'])
  .config(routing)
  .component('pciProjectNotebooksAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
