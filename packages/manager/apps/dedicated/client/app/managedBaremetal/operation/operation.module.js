import angular from 'angular';

import datacenterOperationComponent from '../../components/dedicated-cloud/operation';
import executionDateEdit from './executionDateEdit';
import routing from './operation.routes';

const moduleName = 'managedBaremetalOperationModule';

angular
  .module(moduleName, [datacenterOperationComponent, executionDateEdit])
  .config(routing);

export default moduleName;
