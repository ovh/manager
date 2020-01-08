angular
  .module('managerApp')
  .config((atInternetControllerDecoratorsProvider) => {
    atInternetControllerDecoratorsProvider.decorate({
      CloudProjectComputeInfrastructureDiagramCtrl: {
        initInfra(atInternet, controller) {
          controller.Cloud.Project()
            .v6()
            .query()
            .$promise.then((projects) => {
              atInternet.trackEvent({
                event: `CloudProject-${projects.length}`,
                page:
                  'cloud::iaas::pci-project::compute::infrastructure::diagram',
              });
            });
        },
      },
    });
  });
