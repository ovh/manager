import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import routing from './information.routing';

const moduleName = 'ovhManagerExchangeDashboardInformation';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ovhManagerAdvices,
  ])
  .config(routing);

export default moduleName;
