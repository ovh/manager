

/**
 *  Configuration for at-internet tracking
 * */
angular.module('managerApp')
  .config((atInternetControllerDecoratorsProvider) => {
    const quotaReasons = ['QUOTA_VCPUS', 'QUOTA_RAM', 'QUOTA_INSTANCE'];
    atInternetControllerDecoratorsProvider.decorate({
      CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl: {
        viewFlavorsList(atInternet, controller, parameters) {
          const category = _.find(controller.displayData.categories, { category: parameters[1] });
          const isSomeFlavorsDisabled = _.some(
            category.flavors,
            flavor => _.includes(quotaReasons, flavor.disabled),
          );

          if (isSomeFlavorsDisabled) {
            atInternet.trackEvent({
              event: 'over-quota-low',
              page: 'cloud::iaas::pci-project::compute::infrastructure::order',
            });
          }
        },
        onMouseEnterFlavor(atInternet, controller, parameters) {
          if (_.includes(quotaReasons, parameters[1].disabled)) {
            atInternet.trackEvent({
              event: 'over-quota-high',
              page: 'cloud::iaas::pci-project::compute::infrastructure::order',
            });
          }
        },
      },
    });
  });
