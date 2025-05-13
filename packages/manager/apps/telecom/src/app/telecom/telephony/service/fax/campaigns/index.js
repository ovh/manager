import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import './read/read.less';

import controller from './campaigns.controller';
import template from './campaigns.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceFaxCampaigns';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .controller('TelecomTelephonyServiceFaxCampaignsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/fax/campaigns/campaigns.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
