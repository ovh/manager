import feedback from './feedback-icon.svg';

import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $timeout,
    $translate,
    $window,
    atInternet,
    CloudSidebar,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CloudSidebar = CloudSidebar;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;

    this.navbarOptions = options;

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });
  }

  $onInit() {
    this.$translate.refresh()
      .then(() => {
        this.sidebarLinks = this.CloudSidebar.getSidebarLinks(this.$stateParams);
      });
  }
}
