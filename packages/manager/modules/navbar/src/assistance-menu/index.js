import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-otrs';

import 'ovh-ui-angular';

import menuHeader from '../navbar-menu-header';

import { URLS } from './constants';

import component from './component';

const moduleName = 'ovhManagerNavbarAssistanceMenu';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngOvhOtrs',
    'oui',
    'pascalprecht.translate',
    menuHeader,
  ])
  .config(/* @ngInject */ (OtrsPopupProvider) => {
    OtrsPopupProvider.setBaseUrlTickets(URLS.ticket);
  })
  .component('ovhManagerNavbarAssistanceMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
