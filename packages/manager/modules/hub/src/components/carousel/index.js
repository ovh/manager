import angular from 'angular';
import 'angular-translate';

import './styles.less';

import carousel from './carousel.component';

const moduleName = 'ovhManagerHubCarouselComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubCarousel', carousel)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
