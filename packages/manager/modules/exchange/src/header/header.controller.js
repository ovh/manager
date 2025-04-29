export default class HeaderController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    constants,
    coreURLBuilder,
    wucExchange,
    exchangeHeader,
    exchangeServiceInfrastructure,
    messaging,
    navigation,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;

    this.constants = constants;
    this.coreURLBuilder = coreURLBuilder;
    this.wucExchange = wucExchange;
    this.exchangeHeader = exchangeHeader;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.messaging = messaging;
    this.navigation = navigation;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();

    this.exchangeService = this.wucExchange.value;
    this.remoteDisplayName = this.exchangeService.displayName;
    this.displayNameToUpdate = this.remoteDisplayName;
    this.fetchingCanActivateSharepoint();

    this.URLS = this.coreURLBuilder.buildURLs({
      AUTORENEW: {
        application: 'dedicated',
        path: '#/billing/autoRenew',
        params: {
          searchText: this.exchangeService.domain,
        },
      },
    });
  }

  fetchingCanActivateSharepoint() {
    const infrastructureAllowsSharepoint = this.exchangeServiceInfrastructure.isHosted();
    const subsidiaryAllowsSharepoint = this.constants.target === 'EU';

    return this.wucExchange
      .getSharepointService(this.exchangeService)
      .then((sharepoint) => {
        const isAlreadyActivated = sharepoint != null;

        this.canSubscribeToSharepoint =
          !isAlreadyActivated &&
          infrastructureAllowsSharepoint &&
          subsidiaryAllowsSharepoint;
      })
      .catch(() => {
        this.canSubscribeToSharepoint =
          infrastructureAllowsSharepoint && subsidiaryAllowsSharepoint;
      });
  }

  cancelEdition() {
    this.isEditingDisplayName = false;
    this.displayNameToUpdate = this.remoteDisplayName;
  }

  submittingDisplayName() {
    if (this.displayNameEditionForm.$invalid) {
      return this.$q.when();
    }

    this.isSubmittingNewDisplayName = true;

    return this.exchangeHeader
      .updateServiceDisplayName(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.displayNameToUpdate,
      )
      .then(() => {
        this.remoteDisplayName = this.displayNameToUpdate;
        this.$rootScope.$broadcast('change.displayName', [
          this.exchangeService.domain,
          this.remoteDisplayName,
        ]);
        this.messaging.writeSuccess(
          this.$translate.instant('exchange_ACTION_configure_success'),
        );
        this.isEditingDisplayName = false;
      })
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_ACTION_configure_error'),
          error,
        );
        this.cancelEdition();
      })
      .finally(() => {
        this.isSubmittingNewDisplayName = false;
      });
  }
}
