import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import component from './replay-retention.component';
import routing from './replay-retention.routing';

const moduleName = 'ovhManagerPciStreamsStreamReplayRetention';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStreamsStreamReplayRetention', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
