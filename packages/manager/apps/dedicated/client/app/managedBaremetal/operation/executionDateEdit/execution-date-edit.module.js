import angular from 'angular';

import datacenterOperationExecutionDateEditComponent from '../../../components/dedicated-cloud/operation/executionDateEdit';
import routing from './execution-date-edit.routing';

const moduleName = 'managedBaremetalOperationExecutionDateEdit';

angular
  .module(moduleName, [datacenterOperationExecutionDateEditComponent])
  .config(routing);

export default moduleName;
