import angular from 'angular';

import routing from './routing';
import NashaPartitionAccessComponent from './access.component';
import NashaPartitionAccessAdd from './add';
import NashaPartitionAccessDelete from './delete';
// import NashaPartitionAccessAddCtrl from './add/controller';
// import NashaPartitionAccessDeleteCtrl from './delete/controller';

// import addTemplate from './add/template.html';
// import deleteTemplate from './delete/template.html';

import './styles.less';

const moduleName = 'ovhManagerNashaPartitionAccess';

angular
  .module(moduleName, [
    NashaPartitionAccessAdd,
    NashaPartitionAccessDelete,
  ])
  .config(routing)
  .component('nashaPartitionAccessComponent', NashaPartitionAccessComponent)
  // .controller('NashaPartitionAccessCtrl', NashaPartitionAccessCtrl)
  // .controller('NashaPartitionAccessAddCtrl', NashaPartitionAccessAddCtrl)
  // .controller('NashaPartitionAccessDeleteCtrl', NashaPartitionAccessDeleteCtrl)

  .run(/* @ngTranslationsInject:json ./translations */);
// .run(/* @ngInject */ ($templateCache) => {
//   $templateCache.put('nasha/partition/access/add/template.html', addTemplate);
//   $templateCache.put('nasha/partition/access/delete/template.html', deleteTemplate);
// });

export default moduleName;
