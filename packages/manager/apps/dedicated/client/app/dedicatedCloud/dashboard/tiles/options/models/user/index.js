import { name as serviceName, OptionsUserService } from './user.service';

const moduleName = 'ovhManagerPccDashboardOptionsUser';

angular.module(moduleName, []).service(serviceName, OptionsUserService);

export default moduleName;
