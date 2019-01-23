import angular from 'angular';

import choicePopover from './choice-popover';
import offerService from './offer/telecom-telephony-service-offer-task.service';
import timeConditionConfigService from './time-condition-configuration/telecom-telephony-service-time-condition-configuration.service';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [choicePopover])
  .service('voipServiceOfferTask', offerService)
  .service('voipTimeConditionConfiguration', timeConditionConfigService);

export default moduleName;
