import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './calendar-edit.component';

const moduleName = 'ovhManagerPciStoragesDatabasesCalendarEdit';

angular
  .module(moduleName, ['oui'])
  .component('pciDatabasesCalendarEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
