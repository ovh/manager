import angular from 'angular';
import '@uirouter/angularjs';
import regionSelectorComponent from './region-selector.component';
import regionsList from '../../../../../components/project/regions-list';

const moduleName = 'ovhManagerDataProcessingSubmitJobRegionSelectorComponent';

angular
  .module(moduleName, ['ui.router', regionsList])
  .component(
    'dataprocessingSubmitJobRegionSelectorComponent',
    regionSelectorComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
