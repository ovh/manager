import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import associateDeviceComponent from '../../../../../../components/telecom/telephony/associateDevice';

import component from './attach-line.component';
import routing from './attach-line.routing';

const moduleName = 'ovhManagerTelecomTelephonyLinePhoneAccessoriesAttachLine';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    associateDeviceComponent,
  ])
  .component('telephonyLinePhoneAttach', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
