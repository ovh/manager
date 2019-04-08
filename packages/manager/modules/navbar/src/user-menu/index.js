import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import '@ovh-ux/ng-at-internet';

import menuHeader from '../navbar-menu-header';

import component from './component';

const moduleName = 'ovhManagerNavbarUserMenu';

angular
  .module(moduleName, [
    'ngAtInternet',
    'oui',
    'pascalprecht.translate',
    menuHeader,
  ])
  .component('ovhManagerNavbarUserMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
