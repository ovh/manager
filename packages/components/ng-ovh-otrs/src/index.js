import angular from 'angular';
import 'ovh-api-services';
import 'angular-translate';

import {
  ASSISTANCE_ENUM,
  BILLING_ENUM,
  INCIDENT_ENUM,
  INTERVENTION_ENUM,
  CATEGORIES,
  SERVICES,
  UNIVERSES,
} from './otrs-popup/otrs-popup.constant';
import { TICKET_CATEGORIES } from './ticket-categories.constants';
import OtrsPopupCtrl from './otrs-popup/otrs-popup.controller';
import OtrsPopupDirective from './otrs-popup/otrs-popup.directive';
import OtrsPopupProvider from './otrs-popup/otrs-popup.provider';
import OtrsPopupService from './otrs-popup/otrs-popup.service';
import OtrsPopupInterventionService from './otrs-popup/intervention/otrs-popup-intervention.service';

import './otrs.less';

const moduleName = 'ngOvhOtrs';

angular
  .module(moduleName, [
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .constant('OTRS_POPUP_ASSISTANCE_ENUM', ASSISTANCE_ENUM)
  .constant('OTRS_POPUP_BILLING_ENUM', BILLING_ENUM)
  .constant('OTRS_POPUP_INCIDENT_ENUM', INCIDENT_ENUM)
  .constant('OTRS_POPUP_INTERVENTION_ENUM', INTERVENTION_ENUM)
  .constant('OTRS_POPUP_CATEGORIES', CATEGORIES)
  .constant('OTRS_POPUP_SERVICES', SERVICES)
  .constant('OTRS_POPUP_UNIVERSES', UNIVERSES)
  .constant('TICKET_CATEGORIES', TICKET_CATEGORIES)
  .controller('OtrsPopupCtrl', OtrsPopupCtrl)
  .directive('otrsPopup', OtrsPopupDirective)
  .provider('OtrsPopup', OtrsPopupProvider)
  .service('OtrsPopupService', OtrsPopupService)
  .service('OtrsPopupInterventionService', OtrsPopupInterventionService);

export default moduleName;
