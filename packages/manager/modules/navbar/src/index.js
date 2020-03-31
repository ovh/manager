import angular from 'angular';
import moment from 'moment';
import 'moment/min/locales';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-account-sidebar';
import 'ovh-api-services';
import 'ovh-ui-angular';

import notificationsMenu from './notifications-menu';
import userMenu from './user-menu';
import walkMe from './walk-me';

import navbarComponent from './component';
import service from './service';

import './index.less';
import './index.scss';

const moduleName = 'ovhManagerNavbar';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'ovhManagerAccountSidebar',
    'ovh-api-services',
    'oui',
    notificationsMenu,
    userMenu,
    walkMe,
  ])
  .component('ovhManagerNavbar', navbarComponent)
  .service('Navbar', service)
  .config(
    /* @ngInject */ (TranslateServiceProvider) => {
      // set moment locale
      moment.locale(TranslateServiceProvider.getUserLocale());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
