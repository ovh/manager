export default class HeaderController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    atInternet,
    constants,
    coreURLBuilder,
    wucExchange,
    exchangeHeader,
    exchangeServiceInfrastructure,
    messaging,
    navigation,
    officeAttach,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.constants = constants;
    this.coreURLBuilder = coreURLBuilder;
    this.wucExchange = wucExchange;
    this.exchangeHeader = exchangeHeader;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.messaging = messaging;
    this.navigation = navigation;
    this.officeAttach = officeAttach;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();

    this.exchangeService = this.wucExchange.value;
    this.remoteDisplayName = this.exchangeService.displayName;
    this.displayNameToUpdate = this.remoteDisplayName;
    this.fetchingCanActivateSharepoint();
    this.fetchingCanActivateOfficeAttach();

    this.URLS = this.coreURLBuilder.buildURLs({
      AUTORENEW: {
        application: 'dedicated',
        path: '#/billing/autoRenew',
        params: {
          searchText: this.exchangeService.domain,
        },
      },
      ORDER_OFFICE_LICENCE: {
        application: 'web',
        path: '#/configuration/microsoft/office/license/order',
      },
      ACTIVATE_SHAREPOINT: {
        application: 'web',
        path: '#/sharepoint/activate/:organizationId/:exchangeId',
        params: {
          organizationId: this.exchangeService.organization,
          exchangeId: this.exchangeService.domain,
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

  fetchingCanActivateOfficeAttach() {
    return this.officeAttach
      .retrievingIfUserAlreadyHasSubscribed(this.exchangeService.domain)
      .then((userHasAlreadySubscribedToOfficeAttach) => {
        this.canUserSubscribeToOfficeAttach =
          !userHasAlreadySubscribedToOfficeAttach &&
          this.constants.target === 'EU';
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

  removeExchangeDialog() {
    switch (this.Exchange.value.domain.split('-')[0]) {
      case 'private':
      case 'exchange':
        this.atInternet.trackClick({
          name: 'web::microsoft::exchange::dedicated::delete',
          type: 'action',
        });
        this.atInternet.trackPage({
          name: 'web::microsoft::exchange::dedicated::delete',
          type: 'navigation',
        });
        break;
      case 'hosted':
        this.atInternet.trackClick({
          name: 'web::microsoft::exchange::hosted::delete',
          type: 'action',
        });
        this.atInternet.trackPage({
          name: 'web::microsoft::exchange::hosted::delete',
          type: 'navigation',
        });
        break;
      default:
        break;
    }
    this.navigation.setAction(
      'exchange/header/remove/exchange-remove',
      this.exchangeService,
    );
  }
}
