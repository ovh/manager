/**
 * @type module
 * @name ng-ovh-utils
 * @see [url=http://docs.angularjs.org/api/ng.$http]`$http`[/url] service.
 * @description
 * Application level module which depends on the below modules.
 * # Modules
 * [url=#/module=ovhDirectives]`ovhDirectives`[/url]
 * [url=#/module=ovhServices]`ovhServices`[/url]
 * [url=#/module=ovhFilters]`ovhFilters`[/url]
 * # Response interceptors
 * `$httpProvider` use interceptor
 * [url=#/module=ovhServices&service=HttpInterceptor]`HttpInterceptor`[/url].
 */

import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';

import alerter from './alerter/alerter';
import contracts from './contracts/contracts';
import humanReadableSize from './humanReadableSize/humanReadableSize';
import navigator from './navigator/navigator';
import paginationServerSide from './paginationServerSide/paginationServerSide';
import poll from './poll/poll';
import popover from './popover/popover';
import price from './price/price';
import storage from './storage/storage';
import tooltipBox from './tooltipBox/tooltipBox';
import triStateCheckbox from './triStateCheckbox/triStateCheckbox';
import wizard from './wizard/wizard';
import wizardForm from './wizardForm/wizardForm';
import scroll from './scroll/scroll';
import textAccordion from './textAccordion/textAccordion';

const moduleName = 'ngOvhUtils';

angular.module(moduleName, [
  alerter,
  contracts,
  humanReadableSize,
  navigator,
  'ngTranslateAsyncLoader',
  paginationServerSide,
  poll,
  popover,
  price,
  scroll,
  storage,
  tooltipBox,
  triStateCheckbox,
  wizard,
  wizardForm,
  textAccordion,
]);

export default moduleName;
