import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import blackFriday from './black-friday.component';
import blackFridayNotice from './black-friday-notice.component';

import './black-friday.scss';

const moduleName = 'ovhManagerPciBlackFriday';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectBlackFriday', blackFriday)
  .component('pciProjectBlackFridayNotice', blackFridayNotice)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
