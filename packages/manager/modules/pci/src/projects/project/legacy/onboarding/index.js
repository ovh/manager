import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';

import controller from './controller';

const moduleName = 'ovhManagerPciProjectOnboarding';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .controller('pciSlideshowCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
