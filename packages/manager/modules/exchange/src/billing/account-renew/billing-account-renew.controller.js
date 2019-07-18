import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

export default class ExchangeUpdateRenewCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    Exchange,
    exchangeServiceInfrastructure,
    exchangeVersion,
    EXCHANGE_RENEW_PERIODS,
  ) {
    this.services = {
      $scope,
      $translate,
      Exchange,
      exchangeServiceInfrastructure,
      exchangeVersion,
    };
    this.RENEW_PERIODS = EXCHANGE_RENEW_PERIODS;

    $scope.resetAction = () => this.onSuccess();
    $scope.submit = () => this.submit();
  }

  $onInit() {
    this.search = {
      value: null,
    };
    this.buffer = {
      hasChanged: false,
      periodSelectedForAll: null,
      changes: [],
      ids: [],
    };

    this.model = {
      displayDeleteWarning: false,
    };

    this.debouncedRetrieveAccounts = debounce(this.setFilter, 300);

    this.getExchange()
      .then(() => {
        this.initScope();
      });
  }

  initScope() {
    this.services.$scope.hasChanged = () => this.buffer.hasChanged;
    this.services.$scope.getBufferedAccounts = () => this.bufferedAccounts;
    this.services.$scope.getLoading = () => this.loading;
    this.services.$scope.retrieveAccounts = (count, offset) => this.retrieveAccounts(count, offset);
  }

  getExchange() {
    return this.services.Exchange.getExchangeDetails(this.organization, this.exchangeName)
      .then((exchange) => {
        this.exchange = exchange;
      })
      .catch(() => this.onError({ result: this.$translate.instant('exchange_tab_ACCOUNTS_error_message') }));
  }

  canHaveMonthlyRenewal() {
    return !(
      this.services.exchangeServiceInfrastructure.isProvider(this.exchange)
      && this.services.exchangeVersion.isVersion(2010, this.exchange)
    );
  }

  canBeDeletedAtExpiration() {
    return this.services.exchangeServiceInfrastructure.isHosted(this.exchange)
    || this.services.exchangeServiceInfrastructure.isProvider(this.exchange);
  }

  setFilter() {
    this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
  }

  onSearchValueChange() {
    this.debouncedRetrieveAccounts();
  }

  resetSearch() {
    this.search.value = null;
    this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
  }

  checkForChanges() {
    const bufferedAccountList = get(this.bufferedAccounts, 'list.results', []);

    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    this.model.displayDeleteWarning = false;

    forEach(bufferedAccountList, (bufferedAccount) => {
      const currentAccount = find(
        this.accounts.list.results, {
          primaryEmailAddress: bufferedAccount.primaryEmailAddress,
        },
      );

      if (currentAccount.renewPeriod !== bufferedAccount.renewPeriod) {
        this.bufferChanges(bufferedAccount);

        if (bufferedAccount.renewPeriod === 'DELETE_AT_EXPIRATION') {
          this.model.displayDeleteWarning = true;
        }
      } else {
        this.buffer.changes = this.buffer.changes.filter(
          change => change.primaryEmailAddress !== currentAccount.primaryEmailAddress,
        );
      }
    });

    this.buffer.hasChanged = !isEmpty(this.buffer.changes);
  }

  bufferChanges(account) {
    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    const accountInChange = find(
      this.buffer.changes,
      {
        primaryEmailAddress: account.primaryEmailAddress,
      },
    );

    if (accountInChange == null) {
      this.buffer.changes.push({
        primaryEmailAddress: account.primaryEmailAddress,
        primaryEmailDisplayName: account.primaryEmailDisplayName,
        renewPeriod: account.renewPeriod,
        exchangeOffer: this.exchange.offer,
      });
    } else {
      accountInChange.renewPeriod = account.renewPeriod;
    }
  }

  retrieveAccounts(count, offset) {
    this.loading = true;

    this.services.Exchange
      .getAccountsForExchange(this.exchange, count, offset, this.search.value)
      .then((accounts) => {
        this.accounts = accounts;
        this.bufferedAccounts = cloneDeep(accounts);

        const bufferedAccountList = get(this.bufferedAccounts, 'list.results', []);

        this.buffer.ids = bufferedAccountList.map(item => item.primaryEmailAddress);

        // roll previous buffered changes
        if (this.buffer.hasChanged) {
          forEach(bufferedAccountList, (currentBufferedAccount) => {
            const buffer = find(
              this.buffer.changes,
              {
                primaryEmailAddress: currentBufferedAccount.primaryEmailAddress,
              },
            );

            if (buffer != null) {
              set(currentBufferedAccount, 'renewPeriod', buffer.renewPeriod);
            }
          });
        }

        // needed by selectAll checkbox
        forEach(bufferedAccountList, (account) => {
          this.trackSelected(account.primaryEmailAddress, account.renewPeriod);
        });

        set(this.bufferedAccounts, 'list.results', bufferedAccountList);
      })
      .catch((failure) => {
        this.onError({
          result: `${this.services.$translate.instant('exchange_tab_ACCOUNTS_error_message')} ${failure}`,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }

  /**
     * Mark alltems on the page as selected with 'value'.
     * @param value
     */
  checkboxStateChange(value) {
    if (has(this.buffer, 'ids') && this.buffer.ids != null) {
      forEach(this.buffer.ids, (id) => {
        this.trackSelected(id, value);
      });
    }
  }

  trackSelected(primaryEmailAddress, period) {
    const matchingAccount = find(
      this.bufferedAccounts.list.results,
      {
        primaryEmailAddress,
      },
    );

    if (period !== this.buffer.periodSelectedForAll) {
      this.buffer.periodSelectedForAll = null;
    }

    if (matchingAccount != null) {
      matchingAccount.renewPeriod = period;

      this.checkForChanges();
    }

    if (this.bufferedAccounts.list.results.every(({ renewPeriod }) => renewPeriod === period)) {
      this.buffer.periodSelectedForAll = period;
    }
  }

  submit() {
    this.submitLoader = true;

    return this.services.Exchange.updateRenew(
      this.exchange.organization,
      this.exchange.domain,
      this.buffer.changes,
    )
      .then(({ state }) => {
        const updateRenewMessages = {
          OK: this.services.$translate.instant('exchange_update_billing_periode_success'),
          PARTIAL: this.services.$translate.instant('exchange_update_billing_periode_partial'),
          ERROR: this.services.$translate.instant('exchange_update_billing_periode_failure'),
        };

        this.onSuccess({
          result: updateRenewMessages[state],
        });
      })
      .catch((failure) => {
        this.onError({
          result: `${this.services.$translate.instant('exchange_update_billing_periode_failure')} ${failure}`,
        });
      })
      .finally(() => {
        this.submitLoader = false;
      });
  }

  static GetPropertyNameFromPeriodName(period) {
    const capitalizedPeriod = upperFirst(camelCase(period));
    const matchingProperty = camelCase(`selected${capitalizedPeriod}`);

    return matchingProperty;
  }
}
