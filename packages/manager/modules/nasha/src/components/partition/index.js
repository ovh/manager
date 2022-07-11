import angular from 'angular';

import accessModule from './access';
import createModule from './create';
import deleteModule from './delete';
import editNameModule from './edit-name';
import editSizeModule from './edit-size';
import snapshotModule from './snapshot';
import zfsOptionsModule from './zfs-options';

const moduleName = 'ovhManagerNashaComponentsPartition';

angular.module(moduleName, [
  accessModule,
  createModule,
  deleteModule,
  editNameModule,
  editSizeModule,
  snapshotModule,
  zfsOptionsModule,
]);

export default moduleName;
