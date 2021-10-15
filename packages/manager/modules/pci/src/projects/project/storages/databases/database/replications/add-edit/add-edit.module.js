import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import addEditReplicationComponent from './add-edit.component';
import tagsInput from '../../../components/tags-input';
import routing from './add-edit.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseReplicationsAddEdot';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    tagsInput,
  ])
  .config(routing)
  .component(
    'ovhManagerPciProjectDatabaseReplicationsAddEdit',
    addEditReplicationComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
