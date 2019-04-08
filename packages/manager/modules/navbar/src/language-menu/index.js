import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import 'ovh-api-services';

import menuHeader from '../navbar-menu-header';

import component from './component';

const moduleName = 'ovhManagerNavbarLanguageMenu';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    menuHeader,
  ])
  .component('ovhManagerNavbarLanguageMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
