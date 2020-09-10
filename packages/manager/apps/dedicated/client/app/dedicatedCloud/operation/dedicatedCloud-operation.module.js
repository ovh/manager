import angular from 'angular';

import datacenterOperationComponent from '../../components/dedicated-cloud/operation';
import executionDateEdit from './executionDateEdit';
import routing from './dedicatedCloud-operation.routes';

const moduleName = 'dedicatedCloudOperationModule';

angular
  .module(moduleName, [datacenterOperationComponent, executionDateEdit])
  .config(routing);

export default moduleName;
