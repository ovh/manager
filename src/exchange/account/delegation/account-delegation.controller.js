angular.module('Module.exchange.controllers').controller(
  'ExchangeAccountDelegationCtrl',
  class ExchangeAccountDelegationCtrl {
    constructor($scope, Exchange, $timeout, navigation, messaging, $translate) {
      this.services = {
        $scope,
        Exchange,
        $timeout,
        navigation,
        messaging,
        $translate,
      };
    }

    $onInit() {
      this.$routerParams = this.services.Exchange.getParams();
      this.currentAccount = this.services.navigation.currentActionData.primaryEmailAddress;
      this.searchValue = null;
      this.selectedDomain = this.services.navigation.currentActionData.completeDomain;
      this.allDomainsOption = { displayName: this.services.$translate.instant('exchange_all_domains'), name: '' };
      this.availableDomains = [this.allDomainsOption]
        .concat(this.services.navigation.currentActionData.availableDomains);
      this.services.$scope.updateDelegationRight = () => this.updateDelegationRight();
      this.services.$scope.hasChanged = () => this.hasChanged();
      this.services.$scope.getAccounts = (count, offset) => this.getAccounts(count, offset);

      this.services.$scope.$on(
        this.services.Exchange.events.accountsChanged,
        () => this.services.$scope.getAccounts(),
      );

      this.bufferAccounts = [];
    }

    /**
     * Return an array containing changes from the original configuration
     */
    getChanges() {
      const changesList = {
        account: this.currentAccount,
        sendRights: [],
        sendOnBehalfToRights: [],
        fullAccessRights: [],
      };

      this.checkForLocalChanges();

      changesList.sendRights = this.bufferAccounts
        .filter(account => account.newSendAsValue !== account.sendAs)
        .map(account => ({
          id: account.id,
          operation: account.newSendAsValue ? 'POST' : 'DELETE',
        }));

      changesList.sendOnBehalfToRights = this.bufferAccounts
        .filter(account => account.newSendOnBehalfToValue !== account.sendOnBehalfTo)
        .map(account => ({
          id: account.id,
          operation: account.newSendOnBehalfToValue ? 'POST' : 'DELETE',
        }));

      changesList.fullAccessRights = this.bufferAccounts
        .filter(account => account.newFullAccessValue !== account.fullAccess)
        .map(account => ({
          id: account.id,
          operation: account.newFullAccessValue ? 'POST' : 'DELETE',
        }));

      return changesList;
    }

    onSearchValueChange() {
      // clear filter by domain name
      this.selectedDomain = this.allDomainsOption;
      this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'delegationsStep1Table');
    }

    onDomainValueChange() {
      // clear filter by free text search
      this.searchValue = null;
      this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'delegationsStep1Table');
    }

    resetSearch() {
      this.searchValue = null;
      this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'delegationsStep1Table');
    }

    constructResult(data) {
      const mainMessage = {
        OK: this.services.$translate.instant('exchange_ACTION_delegation_success_message'),
        PARTIAL: this.services.$translate.instant('exchange_ACTION_delegation_partial_message'),
        ERROR: this.services.$translate.instant('exchange_ACTION_delegation_error_message'),
      };

      let state = 'OK';
      let numberOfErrors = 0;

      let dataAsArray = data;
      if (!_(dataAsArray).isArray()) {
        dataAsArray = [data];
      }

      let shouldContinue = true;

      _(dataAsArray).forEach((datum) => {
        if (_(datum).isString()) {
          this.services.messaging.setMessage(mainMessage, {
            message: datum,
            type: 'PARTIAL',
          });

          shouldContinue = false;
          return false;
        }
        if (datum.status === 'ERROR') {
          _.set(datum, 'message', this.services.$translate.instant(`exchange_tab_TASKS_${datum.function}`));
          _.set(datum, 'type', 'ERROR');
          state = 'PARTIAL';
          numberOfErrors += 1;
        }

        return true;
      });

      if (!shouldContinue) {
        return;
      }

      if (numberOfErrors === dataAsArray.length) {
        state = 'ERROR';
      }

      this.services.messaging.setMessage(mainMessage, {
        messages: data,
        state,
      });
    }

    checkForLocalChanges() {
      if (_.has(this.accounts, 'list.results')) {
        _.forEach(this.accounts.list.results, (account) => {
          const matchBuffer = _.find(this.bufferAccounts, buffer => buffer.id === account.id);
          if (matchBuffer) {
            matchBuffer.newSendOnBehalfToValue = account.newSendOnBehalfToValue;
            matchBuffer.newSendAsValue = account.newSendAsValue;
            matchBuffer.newFullAccessValue = account.newFullAccessValue;
          }
        });
      }
    }

    checkForBufferChanges(account) {
      _.forEach(this.bufferAccounts, (bufferAccount) => {
        if (bufferAccount.id === account.id) {
          _.set(account, 'newSendAsValue', bufferAccount.newSendAsValue);
          _.set(account, 'newSendOnBehalfToValue', bufferAccount.newSendOnBehalfToValue);
          _.set(account, 'newFullAccessValue', bufferAccount.newFullAccessValue);
        }
      });
    }

    /**
     * Check if there are changes compared to original configuration
     */
    hasChanged() {
      const listOfChanges = this.getChanges();

      return (
        !_.isEmpty(listOfChanges.sendRights)
        || !_.isEmpty(listOfChanges.fullAccessRights)
        || !_.isEmpty(listOfChanges.sendOnBehalfToRights)
      );
    }

    getAccounts(count, offset) {
      this.services.messaging.resetMessages();
      this.loading = true;
      // filter by domain name or free text search
      const filter = this.searchValue || _.get(this.selectedDomain, 'name');
      return this.services.Exchange.retrieveAccountDelegationRight(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.currentAccount,
        count,
        offset,
        filter,
      )
        .then((accounts) => {
          this.accounts = accounts;

          _.forEach(this.accounts.list.results, (account) => {
            _.set(account, 'newSendAsValue', account.sendAs);
            _.set(account, 'newSendOnBehalfToValue', account.sendOnBehalfTo);
            _.set(account, 'newFullAccessValue', account.fullAccess);
            this.checkForBufferChanges(account);

            if (!_.find(this.bufferAccounts, buffer => buffer.id === account.id)) {
              // keep the original data as a reference point to compare changes
              this.bufferAccounts.push(account);
            }
          });
        })
        .catch((failure) => {
          this.services.navigation.resetAction();
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_ACCOUNTS_error_message'),
            failure,
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }

    updateDelegationRight() {
      const changes = this.getChanges();

      return this.services.Exchange.updatingAccountDelegationRights(
        this.$routerParams.organization,
        this.$routerParams.productId,
        changes,
      )
        .then((data) => {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_ACTION_delegation_doing_message'),
          );
          this.constructResult(data);
        })
        .catch((failure) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_ACTION_delegation_error_message'),
            failure.data,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }
  },
);
