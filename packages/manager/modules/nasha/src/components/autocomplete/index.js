import component from './component';
import './styles.less';

const moduleName = 'ovhManagerNashaComponentsAutocomplete';

angular
  .module(moduleName, [])
  .component('nashaComponentsAutocomplete', component);

export default moduleName;
