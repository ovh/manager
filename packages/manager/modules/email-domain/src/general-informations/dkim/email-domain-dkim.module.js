import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './email-domain-dkim.component';
import routing from './email-domain-dkim.routes';

const moduleName = 'ovhManagerEmailDomainDkim';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('emailDomainDkimComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
