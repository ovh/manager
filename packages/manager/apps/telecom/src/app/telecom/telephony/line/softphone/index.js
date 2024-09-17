import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import routing from './softphone.routing';
import component from './softphone.component';
import softphoneService from './softphone.service';
import './softphone.scss';
import deleteModalComponent from './deleteModal/delete-modal.component';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphone';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'oc.lazyLoad',
  ])
  .component('telecomTelephonyLineSoftphoneDeleteModal', deleteModalComponent)
  .component('ovhManagerTelecomTelephonyLineSoftphoneComponent', component)
  .service('softphoneService', softphoneService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
