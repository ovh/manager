export default class ExchangeTabExternalContactsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangeExternalContacts,
    $timeout,
    navigation,
    messaging,
    exchangeStates,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangeExternalContacts,
      $timeout,
      navigation,
      messaging,
      exchangeStates,
    };

    this.$routerParams = wucExchange.getParams();
    this.contactsLoading = false;
    this.contacts = null;

    $scope.getContacts = () => this.contacts;
  }

  loadContacts({ offset, pageSize, criteria }) {
    this.contactsLoading = true;
    return this.services.ExchangeExternalContacts.gettingContacts(
      this.$routerParams.organization,
      this.$routerParams.productId,
      pageSize,
      offset,
      criteria.length > 0 ? criteria[0].value : null,
    )
      .then(({ data, count }) => {
        this.contacts = data;
        return {
          data,
          meta: {
            totalCount: count,
          },
        };
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
      });
  }
}
