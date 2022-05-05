import angular from 'angular';

import createModule from './create';
import deleteModule from './delete';
import editSizeModule from './edit-size';
import zfsOptionsModule from './zfs-options';

const moduleName = 'ovhManagerNashaComponentsPartition';

angular.module(moduleName, [
  createModule,
  deleteModule,
  editSizeModule,
  zfsOptionsModule,
]);

export default moduleName;
