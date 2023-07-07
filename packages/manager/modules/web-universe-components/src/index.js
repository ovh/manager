import angular from 'angular';

import wucApi from './api';
import wucChartjs from './chartjs';
import wucConverter from './converter';
import wucDuration from './duration';
import wucEmailDomain from './email-domain';
import wucExchange from './exchange';
import wucExchangePassword from './exchange-password';
import wucFileChange from './fileChange';
import wucFileEditor from './fileEditor';
import wucGuides from './guides';
import wucOrderCart from './order-cart';
import wucString from './string';
import wucSpfBanner from './spf-banner';
import wucUser from './user';
import wucValidator from './validator';

const moduleName = 'ngOvhWebUniverseComponents';

angular.module(moduleName, [
  wucApi,
  wucChartjs,
  wucConverter,
  wucDuration,
  wucEmailDomain,
  wucExchange,
  wucExchangePassword,
  wucFileChange,
  wucFileEditor,
  wucGuides,
  wucOrderCart,
  wucString,
  wucSpfBanner,
  wucUser,
  wucValidator,
]);

export default moduleName;
