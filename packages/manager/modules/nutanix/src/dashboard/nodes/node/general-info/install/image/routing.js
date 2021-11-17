import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'nutanix.dashboard.nodes.node.general-info.install.image',
    {
      url: '/image',
      component: 'nutanixNodeServerInstallImage',
      params: {
        installSource: null,
      },
      redirectTo: ($transition$) => {
        if ($transition$.params().installSource === null) {
          return {
            state:
              'nutanix.dashboard.nodes.node.general-info.install.choose-source',
          };
        }
        return null;
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('nutanix_node_server_install_image_title'),

        dedicatedApiSchema: /* @ngInject */ (NutanixService) =>
          NutanixService.getDedicatedInstallTemplateApiSchema(),

        imageTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
          get(dedicatedApiSchema, 'models["dedicated.ImageTypesEnum"].enum'),

        checksumTypeEnum: /* @ngInject */ (dedicatedApiSchema) =>
          get(dedicatedApiSchema, 'models["dedicated.CheckSumTypesEnum"].enum'),

        goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,

        installSource: /* @ngInject */ ($transition$) =>
          $transition$.params().installSource,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
