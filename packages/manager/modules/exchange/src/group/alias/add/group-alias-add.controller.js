import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default class ExchangeAddGroupAliasCtrl {
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
    this.selectedMailingList = navigation.currentActionData;
    this.availableDomains = null;
    this.model = {};

    $scope.addGroupAlias = () => this.addGroupAlias();
    $scope.aliasIsValid = () => this.aliasIsValid();
    $scope.loadDomainData = () => this.loadDomainData();
  }

  loadDomainData() {
    this.services.wucExchange
      .getNewAliasOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedMailingList.mailingListName,
        'MAILING_LIST',
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
          err.data,
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

  addGroupAlias() {
    this.services.wucExchange
      .addGroupAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedMailingList.mailingListName,
        this.model,
      )
      .then((data) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_add_alias_success_message',
          ),
          data,
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
