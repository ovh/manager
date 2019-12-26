import angular from 'angular';

import routing from './routing';
import NashaPartitionAccessComponent from './access.component';
import NashaPartitionAccessAdd from './add';
import NashaPartitionAccessDelete from './delete';

import './styles.less';

const moduleName = 'ovhManagerNashaPartitionAccess';

angular
  .module(moduleName, [NashaPartitionAccessAdd, NashaPartitionAccessDelete])
  .config(routing)
  .component('nashaPartitionAccessComponent', NashaPartitionAccessComponent)

  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
