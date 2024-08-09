import angular from 'angular';

import component from './component';
import './style.scss';

const moduleName = 'ovhManagerDedicatedAccountUserDocumentsValidationModal';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('documentUploadValidationModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
