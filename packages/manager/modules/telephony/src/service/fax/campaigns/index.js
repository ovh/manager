import angular from 'angular';

import controller from './telecom-telephony-service-fax-campaigns.controller';

const moduleName = 'ovhManagerTelephonyServiceFaxCampaigns';

angular.module(moduleName, [])
  .run(/* @ngTranslationsInject ./translations */)
  .controller('TelecomTelephonyServiceFaxCampaignsCtrl', controller);

export default moduleName;
