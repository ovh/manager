import angular from 'angular';

import accessModule from './access';
import createModule from './create';
import deleteModule from './delete';
import editSizeModule from './edit-size';
import snapshotModule from './snapshot';
import zfsOptionsModule from './zfs-options';

const moduleName = 'ovhManagerNashaComponentsPartition';

angular.module(moduleName, [
  accessModule,
  createModule,
  deleteModule,
  editSizeModule,
  snapshotModule,
  zfsOptionsModule,
]);

export default moduleName;
