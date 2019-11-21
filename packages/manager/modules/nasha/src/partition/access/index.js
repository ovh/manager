import angular from 'angular';

import routing from './routing';
import NashaPartitionAccessCtrl from './controller';
import NashaPartitionAccessAddCtrl from './add/controller';
import NashaPartitionAccessDeleteCtrl from './delete/controller';

import addTemplate from './add/template.html';
import deleteTemplate from './delete/template.html';

import './styles.less';
import './add/styles.less';

const moduleName = 'ovhManagerNashaPartitionAccess';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('NashaPartitionAccessCtrl', NashaPartitionAccessCtrl)
  .controller('NashaPartitionAccessAddCtrl', NashaPartitionAccessAddCtrl)
  .controller('NashaPartitionAccessDeleteCtrl', NashaPartitionAccessDeleteCtrl)

  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngInject */ ($templateCache) => {
    $templateCache.put('nasha/partition/access/add/template.html', addTemplate);
    $templateCache.put('nasha/partition/access/delete/template.html', deleteTemplate);
  });

export default moduleName;
