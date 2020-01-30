import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';

import notificationsMenu from './notifications-menu';
import userMenu from './user-menu';
import walkMe from './walk-me';

import navbarComponent from './component';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerNavbar';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovh-api-services',
    'oui',
    notificationsMenu,
    userMenu,
    walkMe,
  ])
  .component('ovhManagerNavbar', navbarComponent)
  .service('Navbar', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
