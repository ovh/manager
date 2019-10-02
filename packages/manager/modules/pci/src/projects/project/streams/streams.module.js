import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import add from './add';
import deleteStream from './delete';
import onboarding from './onboarding';
import stream from './stream';

import component from './streams.component';
import routing from './streams.routing';
import service from './streams.service';

const moduleName = 'ovhManagerPciStreams';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    add,
    deleteStream,
    onboarding,
    stream,
  ])
  .config(routing)
  .component('pciProjectStreams', component)
  .service('PciProjectStreamService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
