import angular from 'angular';

import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'ovh-api-services';
import 'ovh-ui-angular';
import 'angular-ui-bootstrap';

import '@ovh-ux/manager-cloud-styles';
import 'font-awesome/css/font-awesome.css';
import 'ovh-ui-kit/dist/oui.css';

import kubernetesDetail from './details/index';
import kubernetesList from './list/index';

import './index.less';

const moduleName = 'ovhManagerPciProjectKubernetesComponent';

angular.module(moduleName, [
  'ngOvhCloudUniverseComponents',
  'oui',
  'ovh-api-services',
  'ui.bootstrap',
  kubernetesList,
  kubernetesDetail,
]);

export default moduleName;
