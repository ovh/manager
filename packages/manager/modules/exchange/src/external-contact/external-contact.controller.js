export default class ExchangeTabExternalContactsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    Exchange,
    ExchangeExternalContacts,
    $timeout,
    navigation,
    messaging,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      Exchange,
      ExchangeExternalContacts,
      $timeout,
      navigation,
      messaging,
      exchangeStates,
    };

    this.$routerParams = Exchange.getParams();
    this.contactsLoading = false;
    this.contacts = null;
    this.filter = null;

    $scope.$on(Exchange.events.externalcontactsChanged, () =>
      $scope.$broadcast('paginationServerSide.reload', 'externalContactsTable'),
    );

    $scope.getContacts = () => this.contacts;
    $scope.getContactsLoading = () => this.contactsLoading;
    $scope.loadContacts = () => this.loadContacts();
  }

  onSearchValueChange() {
    this.loadContacts();
  }

  loadContacts(count, offset) {
    this.contactsLoading = true;

    this.services.ExchangeExternalContacts.gettingContacts(
      this.$routerParams.organization,
      this.$routerParams.productId,
      count,
      offset,
      this.filter,
    )
      .then((contacts) => {
        this.contacts = contacts;
      })
      .catch((data) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_EXTERNAL_CONTACTS_configuration_contact_delete_fail',
          ),
          data,
        );
      })
      .finally(() => {
        this.contactsLoading = false;
        this.services.$scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'externalContactsTable',
        );
      });
  }
}
