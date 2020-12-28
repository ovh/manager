import angular from 'angular';

import datacenterOperationExecutionDateEditComponent from '../../../components/dedicated-cloud/operation/executionDateEdit';
import routing from './dedicatedCloud-operation-executionDateEdit.routing';

const moduleName = 'dedicatedCloudOperationExecutionDateEdit';

angular
  .module(moduleName, [datacenterOperationExecutionDateEditComponent])
  .config(routing);

export default moduleName;
