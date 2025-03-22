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
