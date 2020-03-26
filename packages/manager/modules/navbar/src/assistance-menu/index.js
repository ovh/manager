import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/ng-at-internet';

import 'ovh-ui-angular';

import menuHeader from '../navbar-menu-header';

import component from './component';

const moduleName = 'ovhManagerNavbarAssistanceMenu';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngAtInternet',
    'oui',
    'pascalprecht.translate',
    menuHeader,
  ])
  .component('ovhManagerNavbarAssistanceMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
