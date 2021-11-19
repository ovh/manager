import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './app-image.component';

const moduleName = 'ovhManagerPciProjectAppsAppImage';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    ovhManagerCatalogPrice,
  ])
  .component('appImage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
