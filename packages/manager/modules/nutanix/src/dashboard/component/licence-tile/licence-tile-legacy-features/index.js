import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNutanixLicenceTileLegacyFeatures';

angular
  .module(moduleName, ['oui'])
  .component('nutanixLicenceTileLegacyFeatures', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
