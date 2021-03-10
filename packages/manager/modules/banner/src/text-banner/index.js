import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';

import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import textBanner from './text-banner.component';

import './text-banner.less';

const moduleName = 'ovhManagerBannerTextBanner';

angular
  .module(moduleName, ['pascalprecht.translate', 'ngTranslateAsyncLoader'])
  .component('ovhManagerBannerText', textBanner)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
