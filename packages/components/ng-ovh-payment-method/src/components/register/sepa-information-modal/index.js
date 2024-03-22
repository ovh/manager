import angular from 'angular';

import component from './component';

const moduleName = 'ngOvhPaymentMethodRegisterSepaInformationModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('sepaInformationModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
