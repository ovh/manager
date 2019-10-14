import angular from 'angular';

import addReplicas from './add-replicas';
import connectionDetails from '../connection-details';
import enterpriseCloudDatabaseServiceGetStartedComponent from './get-started.component';
import routing from './get-started.routing';
import nextSteps from './next-steps';
import secureCluster from './secure-cluster';

import './get-started.less';

const moduleName = 'enterpriseCloudDatabaseServiceGetStarted';

angular
  .module(moduleName, [
    addReplicas,
    connectionDetails,
    nextSteps,
    secureCluster,
  ])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceGetStartedComponent', enterpriseCloudDatabaseServiceGetStartedComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
