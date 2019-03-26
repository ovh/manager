import angular from 'angular';
import 'ovh-ui-kit/dist/oui.css';

import './adp.scss';
import adpComponent from './adp.component';
import adpService from './adp.service';
import adpConstants from './adp.constants';
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
  .constant('adpConstants', adpConstants);

export default moduleName;
