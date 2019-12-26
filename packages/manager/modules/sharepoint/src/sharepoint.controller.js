import set from 'lodash/set';

export default class SharepointCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $rootScope,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    constants,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.constants = constants;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.sharepointDomain = this.$stateParams.productId;
    this.exchangeId = this.$stateParams.exchangeId;
    this.worldPart = this.constants.target;
    this.sharepointService.assignGuideUrl(this, 'sharepointGuideUrl');
    this.editMode = false;
    this.loaders = {
      init: true,
    };
    this.stepPath = '';

    this.$scope.alerts = {
      page: 'sharepoint.alerts.page',
      tabs: 'sharepoint.alerts.tabs',
      main: 'sharepoint.alerts.main',
    };

    this.sharepointService
      .getAssociatedExchangeService(this.exchangeId)
      .catch(() => {
        this.isStandAlone = true;
      });

    this.getSharepoint();

    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;
    this.displayName = null;

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;
      if (action) {
        this.stepPath = `sharepoint/${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    };

    this.$scope.resetAction = () => {
      this.$scope.setAction(false);
    };

    this.$scope.$on('$locationChangeStart', () => {
      this.$scope.resetAction();
    });
  }

  editDisplayName() {
    this.displayName = this.sharepoint.displayName || this.sharepoint.domain;
    this.editMode = true;
  }

  saveDisplayName() {
    const displayName = this.displayName || this.sharepoint.domain;
    return this.sharepointService
      .setSharepointDisplayName(this.exchangeId, displayName)
      .then(() => {
        this.sharepoint.displayName = displayName;
        this.$rootScope.$broadcast('change.displayName', [
          this.sharepointDomain,
          this.displayName,
        ]);
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_dashboard_display_name_error'),
          err,
          this.$scope.alerts.tabs,
        );
      })
      .finally(() => {
        this.editMode = false;
      });
  }

  resetDisplayName() {
    this.editMode = false;
  }

  getSharepoint() {
    return this.sharepointService
      .getSharepoint(this.$stateParams.exchangeId)
      .then((sharepoint) => {
        this.sharepoint = sharepoint;
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_dashboard_error'),
          err,
          this.$scope.alerts.page,
        );
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }
}
