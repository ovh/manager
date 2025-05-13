import angular from 'angular';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import '@ovh-ux/ng-ovh-checkbox-table';
import '@ovh-ux/ng-translate-async-loader';

import tucCsvParser from '../../../csv-parser';
import tucFileReader from '../../../file-reader';
import tucPhone from '../../../phone';
import tucToaster from '../../../toaster';
import tucToastError from '../../../toast-error';

import 'angular-ui-bootstrap';
import 'ng-csv';
import '@ovh-ux/ui-kit';

import tucTelecomTelephonyCallsFilteringAddHelperCtrl from './addHelper/telecom-telephony-callsFilteringAddHelper.controller';
import tucTelecomTelephonyCallsFilteringAdd from './telecom-telephony-callsFilteringAdd.component';
import tucTelecomTelephonyCallsFilteringTable from './telecom-telephony-callsFilteringTable.component';

const moduleName = 'tucTelecomTelephonyCallsFiltering';

angular
  .module(moduleName, [
    'ngCsv',
    'ngOvhCheckboxTable',
    'ngTranslateAsyncLoader',
    'oui',
    translate,
    tucCsvParser,
    tucFileReader,
    tucPhone,
    tucToaster,
    tucToastError,
    'ui.bootstrap',
    uiRouter,
  ])
  .controller(
    'tucTelecomTelephonyCallsFilteringAddHelperCtrl',
    tucTelecomTelephonyCallsFilteringAddHelperCtrl,
  )
  .component(
    'tucTelecomTelephonyCallsFilteringAdd',
    tucTelecomTelephonyCallsFilteringAdd,
  )
  .component(
    'tucTelecomTelephonyCallsFilteringTable',
    tucTelecomTelephonyCallsFilteringTable,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
