import angular from 'angular';
<<<<<<< HEAD
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
=======
import ovhManagerCore from '@ovh-ux/manager-core';
import atInternet from '@ovh-ux/ng-at-internet';
>>>>>>> feat(web-cloud): add tracking to termination

import routing from './exchange.routing';

const moduleName = 'ovhManagerExchange';

angular
  .module(moduleName, [
<<<<<<< HEAD
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
=======
    'ngOvhUtils',
    'ngRoute',
    'ui.bootstrap',
    'ngSanitize',
    'ng.ckeditor',
    atInternet,
    components,
    controllers,
    directives,
    ovhManagerCore,
    services,
    ExchangeAccountMfaCreate,
    ExchangeAccountMfaDelete,
>>>>>>> feat(web-cloud): add tracking to termination
  ])
  .config(routing);

export default moduleName;
