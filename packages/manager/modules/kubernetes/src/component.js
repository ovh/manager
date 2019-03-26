import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-cloud-styles';
import 'font-awesome/css/font-awesome.css';
import 'ovh-ui-kit/dist/oui.css';

import kubernetesDetail from './details/index';

import './index.less';
import './index.scss';

const moduleName = 'ovhManagerKubernetesComponent';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
  'ui.bootstrap',
  kubernetesDetail,
]);

export default moduleName;
