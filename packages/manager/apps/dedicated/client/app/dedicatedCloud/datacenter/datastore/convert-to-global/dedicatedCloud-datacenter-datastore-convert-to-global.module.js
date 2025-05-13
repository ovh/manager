import angular from 'angular';

import datacenterDatastoreConvertToGlobalComponent from '../../../../components/dedicated-cloud/datacenter/datastore/convert-to-global';
import routing from './dedicatedCloud-datacenter-datastore-convert-to-global.routes';

const moduleName = 'dedicatedCloudDatacenterDatastoreConvertToGlobalModule';

angular
  .module(moduleName, [datacenterDatastoreConvertToGlobalComponent])
  .config(routing);

export default moduleName;
