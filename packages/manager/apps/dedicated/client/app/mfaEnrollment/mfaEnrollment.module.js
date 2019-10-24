import component from './mfaEnrollment.component';
import routing from './mfaEnrollment.routes';
import './mfaEnrollment.less';

const moduleName = 'ovhManagerMfaEnrollment';

angular
  .module(moduleName, [])
  .component('mfaEnrollment', component)
  .config(routing);

export default moduleName;
