import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ovh-sso-auth';

import menuHeader from '../navbar-menu-header';

import component from './component';

const moduleName = 'ovhManagerNavbarUserMenu';

angular
  .module(moduleName, [
    'ngAtInternet',
    'ngOvhSsoAuth',
    'oui',
    'pascalprecht.translate',
    menuHeader,
  ])
  .component('ovhManagerNavbarUserMenu', component);

export default moduleName;
