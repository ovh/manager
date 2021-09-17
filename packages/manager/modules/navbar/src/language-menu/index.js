import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import 'ovh-api-services';

import languagePicker from './language-picker';

import component from './component';

const moduleName = 'ovhManagerNavbarLanguageMenu';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    languagePicker,
  ])
  .component('ovhManagerNavbarLanguageMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
