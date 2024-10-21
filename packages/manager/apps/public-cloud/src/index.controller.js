import { isTopLevelApplication } from '@ovh-ux/manager-config';

import { getShellClient } from './shell';

export default class PublicCloudController {
  /* @ngInject */
  constructor($scope, $timeout, atInternet) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.atInternet = atInternet;
    this.isTopLevelApplication = isTopLevelApplication();

    this.shell = getShellClient();

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      if (form.$name?.startsWith('instances_add')) {
        return;
      }
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });
  }

  $onInit() {
    this.shell.ux.onRequestClientSidebarOpen(() =>
      this.$timeout(() => this.openSidebar()),
    );
  }

  openSidebar() {
    this.$scope.$broadcast('sidebar:open');
  }
}
