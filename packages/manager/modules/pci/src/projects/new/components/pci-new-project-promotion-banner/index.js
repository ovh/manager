import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import 'angular-translate';

import './index.scss';
import component from './component';

const moduleName = 'ovhManagerPciNewProjectPromotionBanner';
angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate'])
  .component('pciNewProjectPromotionBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
