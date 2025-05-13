import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import bandwidthVrackOrderService from './server.bandwidth-vrack-order.service';
import component from './server.component';
import featureAvailability from './server.feature-availability';
import service from './server.service';
import './server.less';

const moduleName = 'ovhManagerBmServerComponentsServer';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('serverMainPage', component)
  .service('Server', service)
  .service('BandwidthVrackOrderService', bandwidthVrackOrderService)
  .service('DedicatedServerFeatureAvailability', featureAvailability)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
