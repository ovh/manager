import angular from 'angular';

import wucAllDom from './alldom';
import wucApi from './api';
import wucAutorenewInvite from './autorenew-invite';
import wucChartjs from './chartjs';
import wucConverter from './converter';
import wucCron from './cron';
import wucCronValidator from './cron-validator';
import wucDuration from './duration';
import wucEmailDomain from './email-domain';
import wucExpiration from './expiration';
import wucFileChange from './fileChange';
import wucFileEditor from './fileEditor';
import wucGuides from './guides';
import wucIncrementNumber from './incrementNumber';
import wucJavaEnum from './java-enum';
import wucOrderCart from './order-cart';
import wucOvhFileReader from './ovhFileReader';
import wucProgressBarElementCounter from './progressBarElementCounter';
import wucServiceStatusAction from './service-status';
import wucString from './string';
import wucUser from './user';
import wucValidator from './validator';
import wucZoneValidator from './zone-validator';

const moduleName = 'ngOvhWebUniverseComponents';

angular.module(moduleName, [
  wucAllDom,
  wucApi,
  wucAutorenewInvite,
  wucChartjs,
  wucConverter,
  wucCron,
  wucCronValidator,
  wucDuration,
  wucEmailDomain,
  wucExpiration,
  wucFileChange,
  wucFileEditor,
  wucGuides,
  wucIncrementNumber,
  wucJavaEnum,
  wucOrderCart,
  wucOvhFileReader,
  wucProgressBarElementCounter,
  wucServiceStatusAction,
  wucString,
  wucUser,
  wucValidator,
  wucZoneValidator,
]);

export default moduleName;
