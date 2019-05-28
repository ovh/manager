import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-otrs';
import '@ovh-ux/ng-ovh-chatbot';

import 'ovh-ui-angular';

import menuHeader from '../navbar-menu-header';

import { ASSISTANCE_URLS } from './constants';

import component from './component';

const moduleName = 'ovhManagerNavbarAssistanceMenu';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngAtInternet',
    'ngOvhChatbot',
    'ngOvhOtrs',
    'oui',
    'pascalprecht.translate',
    menuHeader,
  ])
  .config(/* @ngInject */ (OtrsPopupProvider, coreConfigProvider) => {
    OtrsPopupProvider.setBaseUrlTickets(ASSISTANCE_URLS[coreConfigProvider.getRegion()].ticket);
  })
  .component('ovhManagerNavbarAssistanceMenu', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
