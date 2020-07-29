import angular from 'angular';
import 'angular-translate';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import ovhManagerNavbarNotificationsList from './notifications-list';

import service from './service';
import component from './component';

import './index.scss';

const moduleName = 'ovhManagerNotificationsSidebar';

angular
  .module(moduleName, [
    'ngAtInternet',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    ovhManagerNavbarNotificationsList,
  ])
  .component('ovhManagerNotificationsSidebar', component)
  .service('NavbarNotifications', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
