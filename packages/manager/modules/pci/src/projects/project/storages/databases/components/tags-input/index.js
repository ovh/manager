import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './tags-input.component';

const moduleName = 'ovhManagerPciStoragesDatabasesTagsInput';

angular
  .module(moduleName, ['oui'])
  .component('tagsInput', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
