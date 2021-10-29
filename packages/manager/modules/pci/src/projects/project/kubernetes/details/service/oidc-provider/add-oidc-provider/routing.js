export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.add-oidc-provider',
    {
      url: '/add-oidc-provider',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceAddOidcProvider',
        },
      },
      layout: 'modal',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('oidcProvider')
          .then((oidcProvider) => {
            return oidcProvider.isDefined()
              ? { state: 'pci.projects.project.kubernetes.details.service' }
              : false;
          }),
      resolve: {
        breadcrumb: () => null,

        oidcProviderModel: /* @ngInject */ (oidcProvider) =>
          oidcProvider.copy(),

        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
      },
    },
  );
};
