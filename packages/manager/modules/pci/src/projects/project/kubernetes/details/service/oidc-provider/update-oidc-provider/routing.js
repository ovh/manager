export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.update-oidc-provider',
    {
      url: '/update-oidc-provider',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceUpdateOidcProvider',
        },
      },
      layout: 'modal',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('oidcProvider')
          .then((oidcProvider) => {
            return oidcProvider.isDefined()
              ? false
              : { state: 'pci.projects.project.kubernetes.details.service' };
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
