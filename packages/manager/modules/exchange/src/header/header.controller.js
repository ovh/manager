export default class HeaderController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    constants,
    coreURLBuilder,
    wucExchange,
    EXCHANGE_CONFIG,
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
    this.EXCHANGE_CONFIG = EXCHANGE_CONFIG;
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

    this.URLS = this.coreURLBuilder.buildURLs({
      AUTORENEW: {
        application: 'dedicated',
        path: '#/billing/autoRenew',
        params: {
          searchText: this.exchangeService.domain,
        },
      },
    });

    this.getCanOrderOffice365();
    this.OFFICE_365_ORDER_URL = this.EXCHANGE_CONFIG.URLS.OFFICE_365_ORDER.DEFAULT;

    this.exchangeHeader.getUserSubsidiary().then((subsidiary) => {
      this.OFFICE_365_ORDER_URL =
        this.EXCHANGE_CONFIG.URLS.OFFICE_365_ORDER[subsidiary] ||
        this.OFFICE_365_ORDER_URL;
    });
  }

  getCanOrderOffice365() {
    return this.exchangeHeader
      .getOfficeTenantServiceName(
        this.exchangeService.domain,
        this.constants.target,
      )
      .then((officeTenantServiceName) => {
        this.canOrderOffice365 =
          !officeTenantServiceName && this.constants.target === 'EU';
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
