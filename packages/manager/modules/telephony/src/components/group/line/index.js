import angular from 'angular';

import phone from './phone';

import groupLineFactory from './group-line.factory';
import groupLineOfferFactory from './offer/line-offer.factory';
import groupLineClick2CallFactory from './clic2Call/line-click2Call.factory';
import groupLineClick2CallFactoryUser from './clic2Call/user/line-click2Call-user.factory';
import groupLineOldOffers from './group-line-offers.service';

const moduleName = 'ovhManagerTelephonyGroupLine';

angular.module(moduleName, [
  phone,
])
  .factory('TelephonyGroupLine', groupLineFactory)
  .factory('TelephonyGroupLineOffer', groupLineOfferFactory)
  .factory('TelephonyGroupLineClick2Call', groupLineClick2CallFactory)
  .factory('TelephonyGroupLineClick2CallUser', groupLineClick2CallFactoryUser)
  .service('VoipLineOldOffers', groupLineOldOffers);

export default moduleName;
