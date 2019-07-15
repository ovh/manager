angular.module('Module.exchange.controllers').controller(
  'ExchangeExternalContactsDeleteCtrl',
  class ExchangeExternalContactsDeleteCtrl {
    constructor($scope, Exchange, ExchangeExternalContacts, navigation, $translate, messaging) {
      this.services = {
        $scope,
        Exchange,
        ExchangeExternalContacts,
        navigation,
        $translate,
        messaging,
      };

      this.$routerParams = Exchange.getParams();
      this.model = {
        externalEmailAddress: navigation.currentActionData,
      };

      $scope.deleteAccount = () => this.deleteAccount();
    }

    deleteAccount() {
      this.services.ExchangeExternalContacts.removingContact(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.model.externalEmailAddress,
      )
        .then((data) => {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant(
              'exchange_tab_EXTERNAL_CONTACTS_configuration_contact_delete_success',
            ),
            data,
          );
        })
        .catch((error) => {
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_tab_EXTERNAL_CONTACTS_configuration_contact_delete_fail',
            ),
            error,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }
  },
);
