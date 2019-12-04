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
import wucHelper from './helper';
import wucIncrementNumber from './incrementNumber';
import wucJavaEnum from './java-enum';
import wucOvhFileReader from './ovhFileReader';
import wucProgressBarElementCounter from './progressBarElementCounter';
import wucServiceStatusAction from './service-status';
import wucString from './string';
import wucTabs from './tabs';
import wucV6UiSwitch from './v6UiSwitch';
import wucValidator from './validator';

const moduleName = 'ngOvhWebUniverseComponents';

angular
  .module(moduleName, [
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
    wucHelper,
    wucIncrementNumber,
    wucJavaEnum,
    wucOvhFileReader,
    wucProgressBarElementCounter,
    wucServiceStatusAction,
    wucString,
    wucTabs,
    wucV6UiSwitch,
    wucValidator,
  ]);

export default moduleName;
