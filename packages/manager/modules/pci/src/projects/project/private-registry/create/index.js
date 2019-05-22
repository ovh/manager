import angular from 'angular';
import createComponent from './create.component';

const moduleName = 'pciProjectPrivateRegistryCreateComponent';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectPrivateRegistryCreateComponent', createComponent);

export default moduleName;
