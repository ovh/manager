import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import component from './backlog-retention.component';
import routing from './backlog-retention.routing';

const moduleName = 'ovhManagerPciStreamsStreamBacklogRetention';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStreamsStreamBacklogRetention', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
