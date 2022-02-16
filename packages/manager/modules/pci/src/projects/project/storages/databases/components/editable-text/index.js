import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './editable-text.component';

const moduleName = 'ovhManagerPciStoragesDatabasesEditableText';

angular
  .module(moduleName, ['oui'])
  .component('editableText', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
