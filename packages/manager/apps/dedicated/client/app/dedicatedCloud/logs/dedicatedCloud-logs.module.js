import angular from 'angular';

import datacenterLogsComponent from '../../components/dedicated-cloud/logs';
import routing from './dedicatedCloud-logs.routes';

const moduleName = 'dedicatedCloudLogsModule';

angular
  .module(moduleName, [datacenterLogsComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
