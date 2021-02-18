import find from 'lodash/find';
import includes from 'lodash/includes';
import some from 'lodash/some';

/**
 *  Configuration for at-internet tracking
 * */
angular
  .module('managerApp')
  .config((atInternetControllerDecoratorsProvider) => {
    const quotaReasons = ['QUOTA_VCPUS', 'QUOTA_RAM', 'QUOTA_INSTANCE'];
    atInternetControllerDecoratorsProvider.decorate({
      CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl: {
        viewFlavorsList(atInternet, controller, parameters) {
          const category = find(controller.displayData.categories, {
            category: parameters[1],
          });
          const isSomeFlavorsDisabled = some(category.flavors, (flavor) =>
            includes(quotaReasons, flavor.disabled),
          );

          if (isSomeFlavorsDisabled) {
            atInternet.trackEvent({
              event: 'over-quota-low',
              page: 'cloud::iaas::pci-project::compute::infrastructure::order',
            });
          }
        },
        onMouseEnterFlavor(atInternet, controller, parameters) {
          if (includes(quotaReasons, parameters[1].disabled)) {
            atInternet.trackEvent({
              event: 'over-quota-high',
              page: 'cloud::iaas::pci-project::compute::infrastructure::order',
            });
          }
        },
      },
    });
  });
