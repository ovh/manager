import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@uirouter/angularjs';
import routing from './softphone.routing';
import component from './softphone.component';
import SoftphoneService from './softphone.service';
import './softphone.scss';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphone';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
  ])
  .component('ovhManagerTelecomTelephonyLineSoftphoneComponent', component)
  .service('SoftphoneService', SoftphoneService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
