angular.module('Module.exchange.controllers').controller(
  'ExchangeAddGroupAliasCtrl',
  class ExchangeAddGroupAliasCtrl {
    constructor($scope, Exchange, navigation, messaging, $translate) {
      this.services = {
        $scope,
        Exchange,
        navigation,
        messaging,
        $translate,
      };

      this.$routerParams = Exchange.getParams();
      this.selectedMailingList = navigation.currentActionData;
      this.availableDomains = null;
      this.model = {};

      $scope.addGroupAlias = () => this.addGroupAlias();
      $scope.aliasIsValid = () => this.aliasIsValid();
      $scope.loadDomainData = () => this.loadDomainData();
    }

    loadDomainData() {
      this.services.Exchange.getNewAliasOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedMailingList.mailingListName,
        'MAILING_LIST',
      )
        .then((data) => {
          if (_.isEmpty(data.availableDomains)) {
            this.services.messaging.writeError(
              this.services.$translate.instant('exchange_tab_ALIAS_add_no_domains'),
            );
            this.services.navigation.resetAction();
          } else {
            this.availableDomains = data.availableDomains;
            this.takenEmails = data.takenEmails;
            this.model.domain = _.first(data.availableDomains);
          }
        })
        .catch((err) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_ALIAS_domain_loading_failure'),
            err.data,
          );
          this.services.navigation.resetAction();
        });
    }

    checkTakenEmails() {
      this.takenEmailError = false;
      const modelIsWellFormed = !_.isEmpty(this.model) && _.isString(this.model.alias) && _.has(this.model, 'domain.name');

      if (modelIsWellFormed) {
        const emailIsAlreadyUsed = !_.isEmpty(this.takenEmails)
          && _.includes(
            this.takenEmails,
            `${this.model.alias.toLowerCase()}@${this.model.domain.name}`,
          );

        if (emailIsAlreadyUsed) {
          this.takenEmailError = true;
        }
      }
    }

    addGroupAlias() {
      this.services.Exchange.addGroupAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.selectedMailingList.mailingListName,
        this.model,
      )
        .then((data) => {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_tab_ALIAS_add_alias_success_message'),
            data,
          );
        })
        .catch((err) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_ALIAS_add_alias_error_message'),
            err,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }

    aliasIsValid() {
      if (_.isEmpty(this.model)) {
        return false;
      }

      const aliasIsValid = !_.isEmpty(this.model.alias)
        && _.isString(this.model.alias)
        && this.model.alias.length <= 64;
      const hasDomain = !_.isEmpty(this.model.domain);

      return aliasIsValid && hasDomain && !this.takenEmailError;
    }
  },
);
