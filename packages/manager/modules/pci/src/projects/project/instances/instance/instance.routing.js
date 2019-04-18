export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.instance', {
    url: '/{instanceId}',
    atInternet: { ignore: true },
    abstract: true,
    resolve: {
      instanceId: /* @ngInject */$transition$ => $transition$.params().instanceId,
    },
  });
};
