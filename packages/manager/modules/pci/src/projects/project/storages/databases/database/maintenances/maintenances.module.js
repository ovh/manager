import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import component from './maintenances.component';
import routing from './maintenances.routing';

import calendarEdit from '../../components/calendar-edit';

const moduleName = 'ovhManagerPciStoragesDatabaseMaintenances';

angular
  .module(moduleName, ['ngOvhCloudUniverseComponents', 'oui', calendarEdit])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseMaintenances', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
