import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerNutanixLicenceTileFeatures';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('nutanixLicenceTileFeatures', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
