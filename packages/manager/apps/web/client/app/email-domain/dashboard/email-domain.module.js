import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './email-domain.routes';

import email from '../email/email.module';
import information from '../general-informations/information.module';
import mailingList from '../mailing-list/mailing-list.module';
import task from '../task/task.module';

const moduleName = 'ovhManagerEmailDomainDashboard';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    email,
    information,
    mailingList,
    task,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
