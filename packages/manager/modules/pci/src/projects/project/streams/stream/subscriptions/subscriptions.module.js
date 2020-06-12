import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import add from './add';
import deleteSubscription from './delete';
import resetCursor from './resetCursor';

import component from './subscriptions.component';
import routing from './subscriptions.routing';
import service from './subscriptions.service';

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
    add,
    deleteSubscription,
    resetCursor,
  ])
  .config(routing)
  .component('pciProjectStreamsStreamSubscriptions', component)
  .service('PciProjectStreamsStreamSubscriptionsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
