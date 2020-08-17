import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import buildingDetails from './move-building-details.component';

const moduleName = 'ovhManagerTelecomPackMoveBuildingDetails';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveBuildingDetails', buildingDetails);

export default moduleName;
