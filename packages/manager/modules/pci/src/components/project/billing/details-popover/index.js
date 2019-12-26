import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './controller';
import service from './service';

import instanceTemplate from './instance.template.html';
import volumeTemplate from './volume.template.html';

const moduleName = 'ovhManagerPciComponentsProjectBillingDetailsPopover';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('DetailsPopoverController', controller)
  .service('DetailsPopoverService', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'pci/components/project/billing/details-popover/instance-details-popover.html',
        instanceTemplate,
      );
      $templateCache.put(
        'pci/components/project/billing/details-popover/volume-details-popover.html',
        volumeTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
