import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import resourceTagging from '@ovh-ux/manager-resource-tagging';

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
    rbx1EolBanner,
    resourceTagging,
  ])
  .component('serverDashboard', component)
  .service('Server', service)
  .service('BandwidthVrackOrderService', bandwidthVrackOrderService)
  .service('DedicatedServerFeatureAvailability', featureAvailability)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
