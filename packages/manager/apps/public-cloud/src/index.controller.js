import feedback from './feedback-icon.svg';

import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $window,
    atInternet,
    CloudSidebar,
    ovhUserPref,
    publicCloud,
    SessionService,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CloudSidebar = CloudSidebar;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.ovhUserPref = ovhUserPref;
    this.publicCloud = publicCloud;
    this.sessionService = SessionService;
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
        this.sessionService.getUser()
          .then((user) => {
            this.user = user;
          });
      });
  }
}
