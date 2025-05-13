import angular from 'angular';
import '@uirouter/angularjs';
import regionSelectorComponent from './region-selector.component';
import regionsList from '../../../../../../components/project/regions-list';

const moduleName =
  'ovhManagerPciProjectDataProcessingAddNotebookRegionSelectorLazyLoading';

angular
  .module(moduleName, ['ui.router', regionsList])
  .component(
    'pciProjectDataProcessingAddNotebookRegionSelector',
    regionSelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
