import angular from 'angular';
import { deleteModal } from '@ovh-ux/manager-components';

import component from './resiliate-modal.component';
import { RESILIATION_CAPACITIES } from './resiliate-modal.constants';

const moduleName = 'ovhManagerBillingResiliateModal';

angular
  .module(moduleName, [deleteModal])
  .component(component.name, component)
  .constant('RESILIATION_CAPACITIES', RESILIATION_CAPACITIES)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
