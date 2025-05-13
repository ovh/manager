import component from './autoconfigure-multipath.component';
import constant from './autoconfigure-multipath.constant';

const moduleName = 'ovhManagerOtbAutoconfigMultipath';

angular
  .module(moduleName, ['ui.router'])
  .component('overTheBoxAutoconfigureMultipath', component)
  .constant('OVERTHEBOX_MULTIPATH', constant);

export default moduleName;
