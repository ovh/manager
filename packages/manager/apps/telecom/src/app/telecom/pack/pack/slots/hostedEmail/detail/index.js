import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './detail.component';
import routing from './detail.routing';

const moduleName = 'ovhManagerTelecomPackHostedEmailDetail';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
  ])
  .component('packSlotHostedEmailDetail', component)
  .config(routing);

export default moduleName;
