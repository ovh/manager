import { commonResolves } from '../../../components/addon/utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service.add-addon', {
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
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      trackTextPrefix: /* @ngInject */ (webPaasDashboardPrefix) =>
        webPaasDashboardPrefix,
    },
    atInternet: {
      ignore: true,
    },
  });
};
