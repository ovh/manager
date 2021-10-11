import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import cdnFlush from '../../cdn/flush';

import routing from './hosting-multisite-cdn-flush.routing';

const moduleName = 'ovhManagerHostingMultisiteCdnFlush';

angular
  .module(moduleName, [cdnFlush, ngTranslateAsyncLoader, uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
