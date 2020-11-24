import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import resume from './move-resume.component';
import { PROMO_DISPLAY } from './move-resume.constant';

const moduleName = 'ovhManagerTelecomPackMoveResume';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('packMoveResume', resume)
  .constant('PROMO_DISPLAY', PROMO_DISPLAY);

export default moduleName;
