import angular from 'angular';

import 'ovh-api-services';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import assistanceMenu from './assistance-menu';
import languageMenu from './language-menu';
import notificationsMenu from './notifications-menu';
import userMenu from './user-menu';
import walkMe from './walk-me';

import navbarComponent from './component';
import service from './service';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './index.less';

const moduleName = 'ovhManagerNavbar';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovh-api-services',
    'oui',
    assistanceMenu,
    languageMenu,
    notificationsMenu,
    userMenu,
    walkMe,
  ])
  .component('ovhManagerNavbar', navbarComponent)
  .service('Navbar', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
