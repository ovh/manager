import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';

const moduleName = 'publicCloudOtrs';

const setBaseUrlTickets = /* @ngInject */ (OtrsPopupProvider, CORE_REDIRECT_URLS) => {
  const { support } = CORE_REDIRECT_URLS;
  OtrsPopupProvider.setBaseUrlTickets(support);
};

angular
  .module(moduleName, [
    ngOvhOtrs,
    ovhManagerCore,
  ])
  .config(setBaseUrlTickets);

export default moduleName;
