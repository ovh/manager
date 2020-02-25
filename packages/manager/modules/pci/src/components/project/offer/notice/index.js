import angular from 'angular';

import component from './notice.component';

const moduleName = 'ovhManagerPciComponentsProjectOfferNotice';

angular
  .module(moduleName, [])
  .component('pciProjectOfferNotice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
