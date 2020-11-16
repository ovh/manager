import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import addComponent from '../datacenter/add';
import component from './datacenters.component';

const moduleName = 'ovhManagerPccDatacenters';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    addComponent,
  ])
  .component('ovhManagerPccDatacenters', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
