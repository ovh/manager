import angular from 'angular';

import choicePopover from './choice-popover';
import offerService from './offer/telecom-telephony-service-offer-task.service';

const moduleName = 'ovhManagerTelephonyService';

angular.module(moduleName, [choicePopover])
  .service('voipServiceOfferTask', offerService);

export default moduleName;
