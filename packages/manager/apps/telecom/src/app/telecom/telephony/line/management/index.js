import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import convert from './convert';
import detailsOffer from './detailsOffer';
import domain from './domain';
import language from './language';
import mgcpIpRestriction from './mgcpIpRestriction';
import offerChange from './offerChange';
import password from './password';
import restrictions from './restrictions';
import terminate from './terminate';

import template from './management.html';
import controller from './management.controller';

const moduleName = 'ovhManagerTelecomTelephonyLineManagement';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    convert,
    detailsOffer,
    domain,
    language,
    mgcpIpRestriction,
    offerChange,
    password,
    restrictions,
    terminate,
  ])
  .controller('TelecomTelephonyLineManagementCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/line/management/management.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
