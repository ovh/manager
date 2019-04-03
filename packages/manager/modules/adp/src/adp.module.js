import angular from 'angular';
import 'ovh-ui-kit/dist/oui.css';

import adpComponent from './adp.component';
import adpService from './adp.service';
import {
  ADP_PUBLIC_CLOUD_STATUS, ADP_CAPABILITIES, ADP_CLOUD_CATALOG_NAME,
  ADP_CLUSTER_MANAGE, ADP_CREDENTIALS_INFO, ADP_FLAVOR_TYPES, ADP_GET_ACTIVITIES,
  ADP_GUIDE_LINKS, ADP_NODE_NAMES, ADP_NODE_TYPES, ADP_PLATFORMS_GET_DETAILS,
  ADP_PLATFORMS_GET_LIST, ADP_URL_NAME,
} from './adp.constants';
import deploy from './deploy';
import service from './service';

const moduleName = 'ovhManagerAdpComponent';

angular
  .module(moduleName, [deploy, service])
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
  .constant('ADP_CREDENTIALS_INFO', ADP_CREDENTIALS_INFO)
  .constant('ADP_FLAVOR_TYPES', ADP_FLAVOR_TYPES)
  .constant('ADP_GET_ACTIVITIES', ADP_GET_ACTIVITIES)
  .constant('ADP_GUIDE_LINKS', ADP_GUIDE_LINKS)
  .constant('ADP_NODE_NAMES', ADP_NODE_NAMES)
  .constant('ADP_NODE_TYPES', ADP_NODE_TYPES)
  .constant('ADP_PLATFORMS_GET_DETAILS', ADP_PLATFORMS_GET_DETAILS)
  .constant('ADP_PLATFORMS_GET_LIST', ADP_PLATFORMS_GET_LIST)
  .constant('ADP_URL_NAME', ADP_URL_NAME);

export default moduleName;
