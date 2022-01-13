import angular from 'angular';

import tucChartjs from './chartjs';
import tucCsvParser from './csv-parser';
import tucCustomAsterisk from './custom-asterisk';
import tucDebounce from './debounce';
import tucEditableServiceName from './editable-service-name';
import tucElapsedTime from './elapsed-time';
import tucFileReader from './file-reader';
import tucFilters from './filters';
import tucGauge from './gauge';
import tucHideOutsideClick from './hideOutsideClick';
import tucInputFile from './input-file';
import tucInputFilter from './input-filter';
import tucIpAddress from './ipAddress';
import tucJsplumb from './jsplumb';
import tucOvhPassword from './ovh-password';
import tucPhone from './phone';
import tucResiliation from './resiliation';
import tucSectionBackLink from './section-back-link';
import tucShippingModeSelection from './shippingModeSelection';
import tucSlider from './slider';
import tucSuccessDrawingCheck from './successDrawingCheck';
import tucTableSort from './table-sort';
import tucTelecomPack from './telecom/pack';
import tucTelecomRetractation from './telecom/retractation';
import tucTelecomSms from './telecom/sms';
import tucTelecomTelephony from './telecom/telephony';
import tucTelecomV4Links from './telecom/v4-links';
import tucTelecomVoip from './telecom/voip';
import tucToaster from './toaster';
import tucToastError from './toast-error';
import tucUiSortableHelpers from './uiSortableHelpers';
import tucUnitHumanize from './unit/humanize';
import tucValidator from './validator';
import tucBankHolidays from './bank-holidays';
import FeatureAvailability from './feature-availability';

const moduleName = 'ngOvhTelecomUniverseComponents';

angular.module(moduleName, [
  tucChartjs,
  tucCsvParser,
  tucCustomAsterisk,
  tucDebounce,
  tucEditableServiceName,
  tucElapsedTime,
  tucFileReader,
  tucFilters,
  tucGauge,
  tucHideOutsideClick,
  tucInputFile,
  tucInputFilter,
  tucIpAddress,
  tucJsplumb,
  tucOvhPassword,
  tucPhone,
  tucResiliation,
  tucSectionBackLink,
  tucShippingModeSelection,
  tucSlider,
  tucSuccessDrawingCheck,
  tucTableSort,
  tucTelecomPack,
  tucTelecomRetractation,
  tucTelecomSms,
  tucTelecomTelephony,
  tucTelecomV4Links,
  tucTelecomVoip,
  tucToaster,
  tucToastError,
  tucUiSortableHelpers,
  tucUnitHumanize,
  tucValidator,
  tucBankHolidays,
]);

export { FeatureAvailability };

export default moduleName;
