import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import routing from './user-contacts-request.routes';
import changeCtrl from './change/user-contacts-request-change.controller';
import receivedCtrl from './received/user-contacts-request-received.controller';
import sendCtrl from './send/user-contacts-request-send.controller';
import changeTpl from './change/user-contacts-request-change.html';
import receivedTpl from './received/user-contacts-request-received.html';
import sendTpl from './send/user-contacts-request-send.html';

import translateAltFilter from './user-contacts-request.filter';

const moduleName = 'UserAccountContactsRequest';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ngPaginationFront,
    ngOvhUtils,
  ])
  .controller('UserAccount.controllers.contacts.request', changeCtrl)
  .controller('UserAccount.controllers.contacts.requestsReceived', receivedCtrl)
  .controller('UserAccount.controllers.contacts.requestsSend', sendCtrl)
  .config(routing)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/contacts/request/change/user-contacts-request-change.html',
        changeTpl,
      );
      $templateCache.put(
        'account/contacts/request/received/user-contacts-request-received.html',
        receivedTpl,
      );
      $templateCache.put(
        'account/contacts/request/send/user-contacts-request-send.html',
        sendTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .filter('ducTranslateAlt', translateAltFilter);

export default moduleName;
