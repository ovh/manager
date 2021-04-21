import { commonResolves } from '../../../components/addon/utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.user-licences.add-addon', {
    url: '/:addonType',
    views: {
      modal: {
        component: 'webPaasProjectAddAddon',
      },
    },
    params: {
      addonType: null,
    },
    layout: 'modal',
    resolve: {
      ...commonResolves,
      goBack: /* @ngInject */ (goToUserLicences) => goToUserLicences,
    },
  });
};
