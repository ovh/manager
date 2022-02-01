import component from './autoconfigure-multipath.component';

const moduleName = 'ovhManagerOtbAutoconfigMultipath';

angular
  .module(moduleName, ['ui.router'])
  .component('overTheBoxAutoconfigureMultipath', component);

export default moduleName;
