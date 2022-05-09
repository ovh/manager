import angular from 'angular';

import NashaPartitionCtrl from './controller';
import routing from './routing';

import partitionHelpTemplate from './partition-help.html';

import NashaPartitionComponent from './partition.component';
import NashaPartitionAdd from './add';
import NashaPartitionDelete from './delete';
import NashaPartitionUpdate from './update';
import NashaPartitionSnapshot from './snapshot';
import NashaPartitionCustomSnapshot from './custom-snapshot';
import NashaPartitionZfsOptions from './zfs-options';

import NashaPartitionZfsOptionsService from './zfs-options/service';
import access from './access';

import './styles.less';
import './custom-snapshot/styles.less';

const moduleName = 'ovhManagerNashaPartition';

angular
  .module(moduleName, [
    access,
    NashaPartitionAdd,
    NashaPartitionCustomSnapshot,
    NashaPartitionDelete,
    NashaPartitionSnapshot,
    NashaPartitionUpdate,
    NashaPartitionZfsOptions,
  ])
  .config(routing)
  .controller('NashaPartitionCtrl', NashaPartitionCtrl)
  .service('NashaPartitionZfsOptionsService', NashaPartitionZfsOptionsService)

  .component('nashaPartitionComponent', NashaPartitionComponent)

  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'nasha/partition/partition-help.html',
        partitionHelpTemplate,
      );
    },
  );

export default moduleName;
