import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import contactsService from './service/contacts-service.module';
import contactsServiceEdit from './service/edit/edit.module';
import routing from './user-contacts.routes';
import service from './user-contacts.service';
import contactsRequest from './request/user-contacts-request.module';

const moduleName = 'UserAccountContacts';

angular
  .module(moduleName, [
    contactsService,
    contactsServiceEdit,
    ngAtInternet,
    ngOvhHttp,
    ngOvhSwimmingPoll,
    'oui',
    'pascalprecht.translate',
    contactsRequest,
    'ui.router',
  ])
  .service('UserAccountContactsService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
