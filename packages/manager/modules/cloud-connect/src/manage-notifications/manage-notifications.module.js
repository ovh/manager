import angular from 'angular';

import cloudConnectManageNotificationsComponent from '../components/manage-notifications';
import routing from './manage-notifications.routes';

const moduleName = 'cloudConnectManageNotificationsModule';

angular
  .module(moduleName, [cloudConnectManageNotificationsComponent])
  .config(routing);

export default moduleName;
