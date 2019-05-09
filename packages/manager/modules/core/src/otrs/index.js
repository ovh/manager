import angular from 'angular';
import '@ovh-ux/ng-ovh-otrs';

import get from 'lodash/get';

import {
  REDIRECT_URLS,
} from '../manager-core.constants';

const moduleName = 'ovhManagerCoreOtrs';

angular
  .module(moduleName, [
    'ngOvhOtrs',
  ])
  .config((OtrsPopupProvider) => {
    OtrsPopupProvider.setBaseUrlTickets(get(REDIRECT_URLS, 'support'));
  });

export default moduleName;
