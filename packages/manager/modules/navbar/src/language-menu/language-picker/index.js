import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import 'ovh-api-services';

import component from './component';

import './index.scss';

const moduleName = 'ovhManagerNavbarLanguageMenuPicker';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('ovhManagerNavbarLanguageMenuPicker', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
