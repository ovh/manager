export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.kubernetes.details.service.remove-oidc-provider',
    {
      url: '/remove-oidc-provider',
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceRemoveOidcProvider',
        },
      },
      layout: 'modal',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('oidcProvider')
          .then((oidcProvider) => {
            return !oidcProvider.isDefined()
              ? { state: 'pci.projects.project.kubernetes.details.service' }
              : false;
          }),
      resolve: {
        breadcrumb: () => null,

        goBack: /* @ngInject */ (goToKubernetesDetails) =>
          goToKubernetesDetails,
      },
    },
  );
};
