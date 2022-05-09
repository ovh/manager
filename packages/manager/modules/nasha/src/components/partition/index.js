import angular from 'angular';

import createModule from './create';
import deleteModule from './delete';
import editNameModule from './edit-name';
import editSizeModule from './edit-size';
import zfsOptionsModule from './zfs-options';

const moduleName = 'ovhManagerNashaComponentsPartition';

angular.module(moduleName, [
  createModule,
  deleteModule,
  editNameModule,
  editSizeModule,
  zfsOptionsModule,
]);

export default moduleName;
