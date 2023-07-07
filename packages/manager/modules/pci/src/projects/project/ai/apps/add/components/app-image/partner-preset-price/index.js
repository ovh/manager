import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './partner-preset-price.component';

const moduleName = 'ovhManagerPciProjectAppsAppImagePartnerPresetPrice';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    ovhManagerCatalogPrice,
  ])
  .component('pciProjectPartnerPresetPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
