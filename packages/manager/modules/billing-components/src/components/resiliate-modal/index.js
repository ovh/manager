import angular from 'angular';
import { deleteModal } from '@ovh-ux/manager-components';

import component from './resiliate-modal.component';
import {
  RESILIATION_CAPACITIES,
  RESILIATION_DEFAULT_CAPABILITY,
} from './resiliate-modal.constants';

const moduleName = 'ovhManagerBillingResiliateModal';

angular
  .module(moduleName, [deleteModal])
  .component(component.name, component)
  .constant('RESILIATION_CAPACITIES', RESILIATION_CAPACITIES)
  .constant('RESILIATION_DEFAULT_CAPABILITY', RESILIATION_DEFAULT_CAPABILITY)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
