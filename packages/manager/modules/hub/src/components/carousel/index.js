import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import carousel from './carousel.component';

import './carousel.scss';

const moduleName = 'ovhManagerHubCarouselComponent';

angular
  .module(moduleName, [
    'oui',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubCarousel', carousel)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
