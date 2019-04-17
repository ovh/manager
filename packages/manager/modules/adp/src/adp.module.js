import angular from 'angular';
import 'font-awesome/css/font-awesome.css';

import adpComponent from './adp.component';
import adpService from './adp.service';

import './adp.scss';

import {
  ADP_PUBLIC_CLOUD_STATUS, ADP_CLOUD_CATALOG_NAME,
  ADP_CLUSTER_MANAGE, ADP_CREDENTIALS_INFO, ADP_COMPUTE,
  ADP_FLAVOR_TYPES, ADP_GUIDE_LINKS, ADP_NODE_NAMES, ADP_NODE_TYPES,
  ADP_STATUS_MAP, ADP_SERVICES, ADP_STATUS, ADP_NODE_FILTERS,
} from './adp.constants';

import {
  ADP_CAPABILITIES, ADP_CLUSTER_DEPLOY_STATUS, ADP_CLUSTER_NODES, ADP_GET_ACTIVITIES,
  ADP_PLATFORMS_GET_DETAILS, ADP_PLATFORMS_GET_DETAILS2, ADP_PLATFORMS_GET_LIST,
} from './adp.mock';

import deploy from './deploy';
import service from './service';
import list from './list';

const moduleName = 'ovhManagerAdpComponent';

angular
  .module(moduleName, [deploy, service, list])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('adp', {
      url: '/adp',
      component: 'adpComponent',
      translations: {
        value: [
          '.',
        ],
        format: 'json',
      },
    });
  })
  .component('adpComponent', adpComponent)
  .service('adpService', adpService)
  .constant('ADP_PUBLIC_CLOUD_STATUS', ADP_PUBLIC_CLOUD_STATUS)
  .constant('ADP_CAPABILITIES', ADP_CAPABILITIES)
  .constant('ADP_CLOUD_CATALOG_NAME', ADP_CLOUD_CATALOG_NAME)
  .constant('ADP_CLUSTER_MANAGE', ADP_CLUSTER_MANAGE)
  .constant('ADP_CLUSTER_NODES', ADP_CLUSTER_NODES)
  .constant('ADP_CREDENTIALS_INFO', ADP_CREDENTIALS_INFO)
  .constant('ADP_FLAVOR_TYPES', ADP_FLAVOR_TYPES)
  .constant('ADP_GET_ACTIVITIES', ADP_GET_ACTIVITIES)
  .constant('ADP_GUIDE_LINKS', ADP_GUIDE_LINKS)
  .constant('ADP_NODE_NAMES', ADP_NODE_NAMES)
  .constant('ADP_NODE_TYPES', ADP_NODE_TYPES)
  .constant('ADP_PLATFORMS_GET_DETAILS', ADP_PLATFORMS_GET_DETAILS)
  .constant('ADP_PLATFORMS_GET_DETAILS2', ADP_PLATFORMS_GET_DETAILS2)
  .constant('ADP_PLATFORMS_GET_LIST', ADP_PLATFORMS_GET_LIST)
  .constant('ADP_STATUS_MAP', ADP_STATUS_MAP)
  .constant('ADP_SERVICES', ADP_SERVICES)
  .constant('ADP_CLUSTER_DEPLOY_STATUS', ADP_CLUSTER_DEPLOY_STATUS)
  .constant('ADP_STATUS', ADP_STATUS)
  .constant('ADP_NODE_FILTERS', ADP_NODE_FILTERS)
  .constant('ADP_COMPUTE', ADP_COMPUTE);

export default moduleName;
