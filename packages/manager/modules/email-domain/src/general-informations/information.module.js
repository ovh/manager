import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import dkim from './dkim/email-domain-dkim.module';
import routing from './email-domain-general-informations.routes';

const moduleName = 'ovhManagerEmailDomainDashboardInformation';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    dkim,
  ])
  .config(routing);

export default moduleName;
