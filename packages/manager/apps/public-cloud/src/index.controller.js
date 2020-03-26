import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $timeout,
    $translate,
    $window,
    atInternet,
    ovhUserPref,
    publicCloud,
    SessionService,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
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
    [this.currentLanguage] = this.$translate.use().split('_');

    this.$translate.refresh().then(() => {
      this.sessionService.getUser().then((user) => {
        this.user = user;
      });
    });
  }

  openSidebar() {
    this.$scope.$broadcast('sidebar:open');
  }
}
