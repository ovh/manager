import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';

import vmacUnavailableBanner from '../vmac-unavailable-banner';
import rbx1EolBanner from '../rbx1-eol-banner';
import service from '../server/server.service';
import bandwidthVrackOrderService from '../server/server.bandwidth-vrack-order.service';
import featureAvailability from '../server/server.feature-availability';
import component from './dashboard.component';

const moduleName = 'ovhManagerBmServerComponentsServerDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    vmacUnavailableBanner,
    rbx1EolBanner,
  ])
  .component('serverDashboard', component)
  .service('Server', service)
  .service('BandwidthVrackOrderService', bandwidthVrackOrderService)
  .service('DedicatedServerFeatureAvailability', featureAvailability)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
