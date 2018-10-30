import angular from 'angular';
import resource from 'angular-resource';
import translate from 'angular-translate';
import set from 'lodash/set';

import core from '@ovh-ux/ovh-manager-core'; // eslint-disable-line import/no-extraneous-dependencies

import template from './navbar.html';
import controller from './navbar.controller';
import navbarService from './navbar.service';
import notificationService from './navbar-notification.service';

import 'ovh-api-services';
import 'ovh-ui-angular';
import 'ovh-angular-otrs';

export default angular
  .module('ovhManagerNavbar', [
    core,
    resource,
    translate,
    'ovh-api-services',
    'oui',
    'ovh-angular-otrs',
  ])
  .component('ovhManagerNavbar', {
    template,
    controller,
  })
  .service('ManagerNavbarService', navbarService)
  .service('NavbarNotificationService', notificationService)

  .run(($translate, asyncLoader, ouiNavbarConfiguration) => {
    asyncLoader.addTranslations(
      import(`./translations/Messages_${$translate.use()}.xml`)
        .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
        .then(x => x.default),
    );
    $translate.refresh();
    set(ouiNavbarConfiguration, 'translations', {
      notification: {
        errorInNotification: $translate.instant('navbar_notification_error_in_notification'),
        errorInNotificationDescription: $translate.instant('navbar_notification_error_in_notification_description'),
        markRead: $translate.instant('navbar_notification_mark_as_read'),
        markUnread: $translate.instant('navbar_notification_mark_as_unread'),
        noNotification: $translate.instant('navbar_notification_none'),
        noNotificationDescription: $translate.instant('navbar_notification_none_description'),
      },
    });
  })
  .name;
