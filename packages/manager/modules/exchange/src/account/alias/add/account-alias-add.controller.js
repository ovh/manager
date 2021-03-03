import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default class ExchangeAddAccountAliasCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, navigation, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      navigation,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.selectedAccount = navigation.currentActionData;
    this.data = null;
    this.model = {};

    $scope.addAccountAlias = () => this.addAccountAlias();
    $scope.aliasIsValid = () => this.aliasIsValid();

    this.loadDomainData();
  }

  loadDomainData() {
    this.services.wucExchange
      .getNewAliasOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedAccount.primaryEmailAddress,
        'ACCOUNT',
      )
      .then((data) => {
        if (isEmpty(data.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_tab_ALIAS_add_no_domains',
            ),
          );
          this.services.navigation.resetAction();
        } else {
          this.availableDomains = data.availableDomains;
          this.takenEmails = data.takenEmails;
          this.model.domain = head(data.availableDomains);
        }
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_domain_loading_failure',
          ),
          err,
        );
        this.services.navigation.resetAction();
      });
  }

  checkTakenEmails() {
    this.takenEmailError = false;
    const modelIsWellFormed =
      !isEmpty(this.model) &&
      isString(this.model.alias) &&
      has(this.model, 'domain.name');

    if (modelIsWellFormed) {
      const emailIsAlreadyUsed =
        !isEmpty(this.takenEmails) &&
        includes(
          this.takenEmails,
          `${this.model.alias.toLowerCase()}@${this.model.domain.name}`,
        );

      if (emailIsAlreadyUsed) {
        this.takenEmailError = true;
      }
    }
  }

  addAccountAlias() {
    return this.services.wucExchange
      .addAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedAccount.primaryEmailAddress,
        this.model,
      )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_add_alias_success_message',
          ),
        );
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_add_alias_error_message',
          ),
          err,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }

  aliasIsValid() {
    if (isEmpty(this.model)) {
      return false;
    }

    const aliasIsValid =
      !isEmpty(this.model.alias) &&
      isString(this.model.alias) &&
      this.model.alias.length <= 64;
    const hasDomain = !isEmpty(this.model.domain);

    return aliasIsValid && hasDomain && !this.takenEmailError;
  }
}
