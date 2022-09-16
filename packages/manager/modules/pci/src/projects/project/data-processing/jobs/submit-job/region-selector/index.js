import angular from 'angular';
import '@uirouter/angularjs';
import regionSelectorComponent from './region-selector.component';
import regionsList from '../../../../../../components/project/regions-list';

const moduleName =
  'ovhManagerPciProjectDataProcessingSubmitJobRegionSelectorLazyLoading';

angular
  .module(moduleName, ['ui.router', regionsList])
  .component(
    'pciProjectDataProcessingSubmitJobRegionSelector',
    regionSelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
