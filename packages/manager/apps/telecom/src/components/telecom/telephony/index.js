import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import 'ovh-api-services';

import groupFactory from './group/group.factory';
import groupFaxFactory from './group/fax/fax.factory';
import groupLineFactory from './group/line/line.factory';
import groupLineClick2CallFactory from './group/line/click2Call/click-2-call.factory';
import groupLineClick2CallUserFactory from './group/line/click2Call/user/user.factory';
import groupLineOfferFactory from './group/line/offer/offer.factory';
import groupLinePhoneFactory from './group/line/phone/phone.factory';
import groupLinePhoneConfigurationFactory from './group/line/phone/configuration/configuration.factory';
import groupNumberOvhPabxFactory from './group/number/feature/ovhPabx/ovh-pabx.factory';
import groupNumberOvhPabxDiaplplanFactory from './group/number/feature/ovhPabx/dialplan/dialplan.factory';
import groupNumberOvhConferenceFactory from './group/number/feature/conference/conference.factory';
import groupNumberOvhConferenceParticipanFactory from './group/number/feature/conference/partiticipant/participant.factory';
import groupNumberOvhEasyHuntingFactory from './group/number/feature/easyHunting/easy-hunting.factory';
import groupNumberEasyPabxFactory from './group/number/feature/easyPabx/easy-pabx.factory';
import groupNumberMiniPabxFactory from './group/number/feature/miniPabx/mini-pabx.factory';
import groupNumberOvhPabxDialplanExtensionFactory from './group/number/feature/ovhPabx/dialplan/extension/extension.factory';
import groupNumberOvhPabxDialplanExtensionRuleFactory from './group/number/feature/ovhPabx/dialplan/extension/rule/rule.factory';
import groupNumberOvhPabxMenuFactory from './group/number/feature/ovhPabx/menu/menu.factory';
import groupNumberOvhPabxMenuEntryFactory from './group/number/feature/ovhPabx/menu/entry/entry.factory';
import groupNumberOvhPabxSoundFactory from './group/number/feature/ovhPabx/sound/sound.factory';
import groupNumberOvhPabxTtsFactory from './group/number/feature/ovhPabx/tts/tts.factory';
import groupNumberRedirectFactory from './group/number/feature/redirect/redirect.factory';
import groupNumberSviFactory from './group/number/feature/svi/svi.factory';

import groupLinePhoneFunctionFactory from './group/line/phone/function/function.factory';
import groupNumberFactory from './group/number/number.factory';
import groupNumberFeatureFactory from './group/number/feature/feature.factory';
import schedulerFactory from './scheduler/scheduler.factory';
import schedulerEventsFactory from './scheduler/events/events.factory';
import schedulerService from './scheduler/scheduler.service';
import timeConditionService from './timeCondition/time-condition.service';
import timeConditionFactory from './timeCondition/time-condition.factory';
import timeConditionConditionFactory from './timeCondition/condition/condition.factory';
import timeConditionSlotFactory from './timeCondition/slot/slot.factory';
import groupLineOffersService from './group/line/line-offers.service';
import mediatorService from './mediator.service';
import voipService from './voip-service.service';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephony';

angular
  .module(moduleName, [ngOvhTelecomUniverseComponents, 'ovh-api-services'])
  .factory('TelephonyGroup', groupFactory)
  .factory('TelephonyGroupFax', groupFaxFactory)
  .factory('TelephonyGroupLine', groupLineFactory)
  .factory('TelephonyGroupLineClick2Call', groupLineClick2CallFactory)
  .factory('TelephonyGroupLineClick2CallUser', groupLineClick2CallUserFactory)
  .factory('TelephonyGroupLineOffer', groupLineOfferFactory)
  .factory('TelephonyGroupLinePhone', groupLinePhoneFactory)
  .factory(
    'TelephonyGroupLinePhoneConfiguration',
    groupLinePhoneConfigurationFactory,
  )

  .factory('TelephonyGroupNumberConference', groupNumberOvhConferenceFactory)
  .factory(
    'TelephonyGroupNumberConferenceParticipant',
    groupNumberOvhConferenceParticipanFactory,
  )
  .factory('TelephonyGroupNumberEasyHunting', groupNumberOvhEasyHuntingFactory)
  .factory('TelephonyGroupNumberEasyPabx', groupNumberEasyPabxFactory)
  .factory('TelephonyGroupNumberMiniPabx', groupNumberMiniPabxFactory)
  .factory('TelephonyGroupNumberOvhPabx', groupNumberOvhPabxFactory)
  .factory(
    'TelephonyGroupNumberOvhPabxDialplan',
    groupNumberOvhPabxDiaplplanFactory,
  )
  .factory(
    'TelephonyGroupNumberOvhPabxDialplanExtension',
    groupNumberOvhPabxDialplanExtensionFactory,
  )
  .factory(
    'TelephonyGroupNumberOvhPabxDialplanExtensionRule',
    groupNumberOvhPabxDialplanExtensionRuleFactory,
  )
  .factory('TelephonyGroupNumberOvhPabxMenu', groupNumberOvhPabxMenuFactory)
  .factory(
    'TelephonyGroupNumberOvhPabxMenuEntry',
    groupNumberOvhPabxMenuEntryFactory,
  )
  .factory('TelephonyGroupNumberOvhPabxSound', groupNumberOvhPabxSoundFactory)
  .factory('TelephonyGroupNumberOvhPabxTts', groupNumberOvhPabxTtsFactory)
  .factory('TelephonyGroupNumberRedirect', groupNumberRedirectFactory)
  .factory('TelephonyGroupNumberSvi', groupNumberSviFactory)
  .factory('VoipScheduler', schedulerFactory)
  .factory('VoipSchedulerEvent', schedulerEventsFactory)
  .factory('TelephonyGroupLinePhoneFunction', groupLinePhoneFunctionFactory)
  .factory('TelephonyGroupNumber', groupNumberFactory)
  .factory('TelephonyGroupNumberFeature', groupNumberFeatureFactory)
  .factory('VoipTimeCondition', timeConditionFactory)
  .factory('VoipTimeConditionCondition', timeConditionConditionFactory)
  .factory('VoipTimeConditionSlot', timeConditionSlotFactory)
  .service('VoipLineOldOffers', groupLineOffersService)
  .service('TelephonyMediator', mediatorService)
  .service('TelephonyVoipService', voipService)
  .service('telephonyScheduler', schedulerService)
  .service('voipTimeCondition', timeConditionService);

export default moduleName;
