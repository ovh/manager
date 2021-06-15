import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './flavors-list.component';

const moduleName = 'ovhManagerPciStoragesDatabasesFlavorsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    ovhManagerCatalogPrice,
  ])
  .component('databaseFlavorsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
