import angular from 'angular';
import translate from 'angular-translate';

import '@ovh-ux/ng-translate-async-loader';

import tucToaster from '../../../toaster';

import 'angular-ui-bootstrap';
import 'ng-csv';
import '@ovh-ux/ui-kit';

import { PAGINATION_PER_PAGE } from './telecom-telephony-abbreviated-numbers.constant';
import tucTelecomTelephonyAbbreviatedNumbersEmptyModal from './empty/telecom-telephony-abbreviated-numbers-empty.modal';
import tucTelecomTelephonyAbbreviatedNumbersImportModal from './import/telecom-telephony-abbreviated-numbers-import.modal';
import tucTelecomTelephonyAbbreviatedNumbersModal from './telecom-telephony-abbreviated-numbers.modal';
import tucTelecomTelephonyAbbreviatedNumbers from './telecom-telephony-abbreviated-numbers.component';

import './telecom-telephony-abbreviated-numbers.less';

const moduleName = 'tucTelecomTelephonyAbbreviatedNumbers';

angular
  .module(moduleName, [
    'ngCsv',
    'ngTranslateAsyncLoader',
    'oui',
    translate,
    tucToaster,
    'ui.bootstrap',
  ])
  .constant(
    'TUC_TELECOM_TELEPHONY_ABBREVIATED_NUMBERS_PAGINATION_PER_PAGE',
    PAGINATION_PER_PAGE,
  )
  .controller(
    'tucTelecomTelephonyAbbreviatedNumbersImportModal',
    tucTelecomTelephonyAbbreviatedNumbersImportModal,
  )
  .controller(
    'tucTelecomTelephonyAbbreviatedNumbersModal',
    tucTelecomTelephonyAbbreviatedNumbersModal,
  )
  .controller(
    'tucTelecomTelephonyAbbreviatedNumbersEmptyModal',
    tucTelecomTelephonyAbbreviatedNumbersEmptyModal,
  )
  .component(
    'tucTelecomTelephonyAbbreviatedNumbers',
    tucTelecomTelephonyAbbreviatedNumbers,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
