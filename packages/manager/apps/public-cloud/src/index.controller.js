import { Environment } from '@ovh-ux/manager-config';
import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $timeout,
    $window,
    atInternet,
    ovhUserPref,
    publicCloud,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$window = $window;
    this.atInternet = atInternet;
    this.ovhUserPref = ovhUserPref;
    this.publicCloud = publicCloud;
    this.navbarOptions = options;

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });
  }

  $onInit() {
    this.currentLanguage = Environment.getUserLanguage();
    this.user = Environment.getUser();
  }

  openSidebar() {
    this.$scope.$broadcast('sidebar:open');
  }
}
