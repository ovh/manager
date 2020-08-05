import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './pack-voipLine-activation.component';
import routing from './pack-voipLine-activation.routing';

const moduleName = 'ovhTelecomPackVoipLineActivation';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    uiRouter,
    'oui',
  ])
  .component('packVoipLineActivation', component)
  .config(routing);

export default moduleName;
