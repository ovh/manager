import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVirtualMachineAddEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  // .config((atInternetControllerDecoratorsProvider) => {
  //   const quotaReasons = ['QUOTA_VCPUS', 'QUOTA_RAM', 'QUOTA_INSTANCE'];
  //   atInternetControllerDecoratorsProvider.decorate({
  //     CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl: {
  //       viewFlavorsList(atInternet, ctrl, parameters) {
  //         const category = find(ctrl.displayData.categories, { category: parameters[1] });
  //         const isSomeFlavorsDisabled = some(
  //           category.flavors,
  //           flavor => includes(quotaReasons, flavor.disabled),
  //         );

  //         if (isSomeFlavorsDisabled) {
  //           atInternet.trackEvent({
  //             event: 'over-quota-low',
  //             page: 'cloud::iaas::pci-project::compute::infrastructure::order',
  //           });
  //         }
  //       },
  //       onMouseEnterFlavor(atInternet, ctrl, parameters) {
  //         if (includes(quotaReasons, parameters[1].disabled)) {
  //           atInternet.trackEvent({
  //             event: 'over-quota-high',
  //             page: 'cloud::iaas::pci-project::compute::infrastructure::order',
  //           });
  //         }
  //       },
  //     },
  //   });
  // })
  .controller('CloudProjectComputeInfrastructureVirtualMachineAddEditCtrl', controller)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/virtualMachine/addEdit/template.html', template);
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
