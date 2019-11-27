import angular from 'angular';

import NashaPartitionCtrl from './controller';
import routing from './routing';
import NashaPartitionAddCtrl from './add/controller';
import NashaPartitionZFSOptionsCtrl from './zfs-options/controller';
import NashaPartitionUpdateCtrl from './update/controller';
import NashaPartitionSnapshotCtrl from './snapshot/controller';
import NashaPartitionDeleteCtrl from './delete/controller';
import NashaPartitionCustomSnapshotAddCtrl from './custom-snapshot/add/controller';

import partitionAccessAddTemplate from './add/template.html';
import partitionHelpTemplate from './partition-help.html';
import deleteTemplate from './delete/template.html';
import updateTemplate from './update/template.html';
import zfsOptionsTemplate from './zfs-options/template.html';
import snapshotTemplate from './snapshot/template.html';
import customSnapshotAddTemplate from './custom-snapshot/add/template.html';

import NashaPartitionZFSOptionsService from './zfs-options/service';
import access from './access';

import './styles.less';
import './custom-snapshot/add/styles.less';

const moduleName = 'ovhManagerNashaPartition';

angular
  .module(moduleName, [access])
  .config(routing)
  .controller('NashaPartitionCtrl', NashaPartitionCtrl)
  .controller('NashaPartitionAddCtrl', NashaPartitionAddCtrl)
  .controller('NashaPartitionDeleteCtrl', NashaPartitionDeleteCtrl)
  .controller('NashaPartitionSnapshotCtrl', NashaPartitionSnapshotCtrl)
  .controller('NashaPartitionUpdateCtrl', NashaPartitionUpdateCtrl)
  .controller('NashaPartitionZFSOptionsCtrl', NashaPartitionZFSOptionsCtrl)
  .controller('NashaPartitionCustomSnapshotAddCtrl', NashaPartitionCustomSnapshotAddCtrl)
  .service('NashaPartitionZFSOptionsService', NashaPartitionZFSOptionsService)

  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($templateCache) => {
    $templateCache.put('nasha/partition/delete/template.html', deleteTemplate);
    $templateCache.put('nasha/partition/add/template.html', partitionAccessAddTemplate);
    $templateCache.put('nasha/partition/partition-help.html', partitionHelpTemplate);
    $templateCache.put('nasha/partition/update/template.html', updateTemplate);
    $templateCache.put('nasha/partition/snapshot/template.html', snapshotTemplate);
    $templateCache.put('nasha/partition/zfs-options/template.html', zfsOptionsTemplate);
    $templateCache.put('nasha/partition/custom-snapshot/add/template.html', customSnapshotAddTemplate);
  });

export default moduleName;
