import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './mailing-list.routing';

import create from './create';
import moderatorDelete from './moderator/delete';
import moderators from './moderators/moderators.module';
import sendListByEmail from './send-list-by-email';
import subscriberDelete from './subscriber/delete';
import subscribers from './subscribers/subscribers.module';
import update from './update';

import tabModulesCtrl from './email-domain-mailing-list-tab-modules.controller';
import service from './email-domain-mailing-list.service';

const moduleName = 'ovhManagerEmailDomainDashboardMailingList';

angular
  .module(moduleName, [
    create,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    moderatorDelete,
    moderators,
    sendListByEmail,
    subscriberDelete,
    subscribers,
    update,
  ])
  .controller('MailingListsTabViewController', tabModulesCtrl)
  .service('MailingLists', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
