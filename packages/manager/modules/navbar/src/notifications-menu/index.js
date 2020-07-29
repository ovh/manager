import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';

import menuHeader from '../navbar-menu-header';
import ovhManagerNavbarNotificationsList from './notifications-list';

import service from './service';
import component from './component';

const moduleName = 'ovhManagerNavbarNotificationsMenu';

angular
  .module(moduleName, [
    'ngAtInternet',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    menuHeader,
    ovhManagerNavbarNotificationsList,
  ])
  .component('ovhManagerNavbarNotificationsMenu', component)
  .service('NavbarNotifications', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
