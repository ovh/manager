import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './subscriptions.component';
import routing from './subscriptions.routing';

const moduleName = 'ovhManagerPciStreamsStreamSubscriptions';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectStreamsStreamSubscriptions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
