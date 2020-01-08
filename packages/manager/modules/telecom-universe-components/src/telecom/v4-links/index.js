import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import tucTelecomV4Links from './telecom-v4-links.component';
import tucTelecomV4Link from './v4-link/telecom-v4-link.component';

import './telecom-v4-links.less';

const moduleName = 'tucTelecomV4Links';

angular
  .module(moduleName, [uiRouter])
  .component('tucTelecomV4Links', tucTelecomV4Links)
  .component('tucTelecomV4Link', tucTelecomV4Link);

export default moduleName;
