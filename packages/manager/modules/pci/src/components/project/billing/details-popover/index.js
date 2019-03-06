import angular from 'angular';

import controller from './controller';
import service from './service';

import instanceTemplate from './instance.template.html';
import volumeTemplate from './volume.template.html';

import './index.less';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular
  .module(moduleName, [])
  .controller('DetailsPopoverController', controller)
  .service('DetailsPopoverService', service)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/components/project/billing/details-popover/instance-details-popover.html', instanceTemplate);
    $templateCache.put('pci/components/project/billing/details-popover/volume-details-popover.html', volumeTemplate);
  });

export default moduleName;
