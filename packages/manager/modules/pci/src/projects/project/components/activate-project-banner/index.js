import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import 'angular-translate';

import './index.scss';
import component from './activate-project-banner.component';

const moduleName = 'ovhManagerPciActivateProjectBanner';
angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate'])
  .component('pciActivateProjectBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
