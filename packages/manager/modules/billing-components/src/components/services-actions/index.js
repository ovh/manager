import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';
import utils from '../utils';

import component from './services-actions.component';

const moduleName = 'ovhManagerHubServicesActions';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    utils,
  ])
  .component('billingServicesActions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
