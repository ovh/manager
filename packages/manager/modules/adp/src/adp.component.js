import angular from 'angular';

import './adp.scss';
import 'ovh-ui-kit/dist/oui.css';

import template from './adp.html';

import deploy from './deploy';

const moduleName = 'ovhManagerAdpComponent';

angular
  .module(moduleName, [deploy])
  .config(($stateProvider) => {
    $stateProvider.state('adp', {
      url: '/adp',
      component: 'ovhManagerAdpComponent',
    });
  })
  .component('ovhManagerAdpComponent', {
    template,
  });

export default moduleName;
