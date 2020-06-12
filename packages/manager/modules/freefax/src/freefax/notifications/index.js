import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import { MAX_NOTIFICATIONS } from './freefax-notifications.constants';
import controller from './freefax-notifications.controller';
import template from './freefax-notifications.html';

import factory from './freefax-notifications.factory';

const moduleName = 'managerFreefaxNotifications';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('freefaxes.freefax.notifications', {
        url: '/notifications',
        controller,
        controllerAs: 'FreefaxNotifications',
        template,
        // noTranslations: true,
        translations: ['..'],
      });
    },
  )
  .constant('FREEFAX_MAX_NOTIFICATIONS', MAX_NOTIFICATIONS)
  .factory('FreefaxNotificationObject', factory);

export default moduleName;
