import { SSO_TRACKING_HITS } from './sso.constants';

export default class IamSsoCtrl {
  /* @ngInject */
  constructor(coreConfig, IamSsoService, $scope, $state, $timeout) {
    this.ssoService = IamSsoService;
    this.me = coreConfig.getUser();
    this.identityProvider = null;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;

    this.$scope.$on('iam.sso.refresh', () => {
      this.$onInit();
    });
  }

  $onInit() {
    this.$scope.trackPage = this.trackPage;
    this.$scope.trackClick = this.trackClick;
    this.initIdentityProvider();

    this.$scope.resetAction = function resetAction() {
      this.$scope.setAction(false);
      this.isModalOpened = false;
    }.bind(this);

    this.$scope.setAction = function setAction(action, data) {
      this.isModalOpened = true;
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;
      if (action) {
        this.$scope.stepPath = `iam/identities/sso/${this.$scope.currentAction}.html`;
      } else {
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }.bind(this);
  }

  goToDetails() {
    this.$scope.trackClick(SSO_TRACKING_HITS.GO_TO_DETAIL);
    this.goToSSODetails();
  }

  createSSO() {
    this.$scope.trackClick(SSO_TRACKING_HITS.CREATE_SSO);
    this.$scope.setAction('add/sso-add');
  }

  updateSSO() {
    this.$scope.trackClick(SSO_TRACKING_HITS.UPDATE_SSO);
    this.$scope.setAction('update/sso-update');
  }

  deleteSSO() {
    this.$scope.trackClick(SSO_TRACKING_HITS.DELETE_SSO);
    this.$scope.setAction('delete/sso-delete');
  }

  initIdentityProvider() {
    this.ssoService
      .getIdentityProvider()
      .then((identityProvider) => {
        this.identityProvider = identityProvider;
      })
      .catch(() => {
        this.identityProvider = null;
      });
  }
}
