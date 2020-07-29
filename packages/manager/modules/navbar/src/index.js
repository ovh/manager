import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-account-sidebar';
import 'moment';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import languageMenu from './language-menu';
import notificationsMenu from './notifications-menu';
import userMenu from './user-menu';
import walkMe from './walk-me';

import navbarComponent from './component';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerNavbar';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovhManagerAccountSidebar',
    'ovh-api-services',
    'oui',
    languageMenu,
    notificationsMenu,
    userMenu,
    walkMe,
  ])
  .component('ovhManagerNavbar', navbarComponent)
  .service('Navbar', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
