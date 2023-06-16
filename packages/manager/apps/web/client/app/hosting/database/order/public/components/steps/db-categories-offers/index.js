import angular from 'angular';

import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerWebHostingDatabaseOrderDbCategoriesOffers';

angular
  .module(moduleName, ['pascalprecht.translate', 'oui'])
  .component('webHostingDatabaseOrderDbCategoriesOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
