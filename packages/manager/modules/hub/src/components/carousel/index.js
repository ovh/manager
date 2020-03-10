import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import './styles.less';

import carousel from './carousel.component';

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
