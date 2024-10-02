import generalInformation from '../dashboard/tiles/general-information';
import component from './dedicatedCloud-dashboard-light.component';
import './dedicatedCloud-dashboard-light.scss';

const moduleName = 'ovhManagerPccDashboardLight';

angular
  .module(moduleName, [generalInformation])
  .component('pccDashboardLight', component);

export default moduleName;
