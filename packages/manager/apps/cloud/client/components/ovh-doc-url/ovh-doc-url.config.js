import { Environment } from '@ovh-ux/manager-config';

angular.module('managerApp').config(
  /* @ngInject */ (ovhDocUrlProvider) => {
    ovhDocUrlProvider.setUserLocale(Environment.getUserLocale());
    ovhDocUrlProvider.setUrlPrefix('/engine/2api');
  },
);
