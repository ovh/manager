import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import deleteStream from './delete';
import regenerateTokens from './regenerateTokens';
import subscriptions from './subscriptions';
import throttling from './throttling';

import component from './stream.component';
import routing from './stream.routing';

const moduleName = 'ovhManagerPciStreamsStream';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    deleteStream,
    regenerateTokens,
    subscriptions,
    throttling,
  ])
  .config(routing)
  .component('pciProjectStreamsStream', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
