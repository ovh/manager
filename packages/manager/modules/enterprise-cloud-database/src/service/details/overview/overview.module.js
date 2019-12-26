import angular from 'angular';

import enterpriseCloudDatabaseServiceDetailsOverviewComponent from './overview.component';
import connectionDetails from '../../connection-details';
import routing from './overview.routing';
import updateName from './update-name';
import updatePassword from './update-password';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsOverview';

angular
  .module(moduleName, [connectionDetails, updateName, updatePassword])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseServiceDetailsOverviewComponent',
    enterpriseCloudDatabaseServiceDetailsOverviewComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
