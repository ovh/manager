import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { RENEW_PERIODS } from './renew.constants';

export default class ExchangeUpdateRenewCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.RENEW_PERIODS = RENEW_PERIODS;
    this.buffer = {
      hasChanged: false,
      periodSelectedForAll: null,
      changes: [],
      ids: [],
    };

    this.displayDeleteWarning = false;
  }

  checkForChanges() {
    const bufferedAccountList = get(this.bufferedAccounts, 'list.results', []);

    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    this.displayDeleteWarning = false;

    forEach(bufferedAccountList, (bufferedAccount) => {
      const currentAccount = find(this.accounts.list.results, {
        primaryEmailAddress: bufferedAccount.primaryEmailAddress,
      });

      if (currentAccount.renewPeriod !== bufferedAccount.renewPeriod) {
        this.bufferChanges(bufferedAccount);

        if (bufferedAccount.renewPeriod === 'DELETE_AT_EXPIRATION') {
          this.displayDeleteWarning = true;
        }
      } else {
        this.buffer.changes = this.buffer.changes.filter(
          (change) =>
            change.primaryEmailAddress !== currentAccount.primaryEmailAddress,
        );
      }
    });

    this.buffer.hasChanged = !isEmpty(this.buffer.changes);
  }

  bufferChanges(account) {
    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    const accountInChange = find(this.buffer.changes, {
      primaryEmailAddress: account.primaryEmailAddress,
    });

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

  static getCriterion(criteria, property) {
    return get(find(criteria, { property }), 'value');
  }

  retrieveAccounts({ criteria, offset, pageSize }) {
    return this.getAccounts(
      pageSize,
      offset - 1, // Avoid offset to start at 1
      ExchangeUpdateRenewCtrl.getCriterion(criteria, null),
    )
      .then((accounts) => {
        this.accounts = accounts;
        this.bufferedAccounts = cloneDeep(accounts);

        const bufferedAccountList = get(
          this.bufferedAccounts,
          'list.results',
          [],
        );

        this.buffer.ids = bufferedAccountList.map(
          (item) => item.primaryEmailAddress,
        );

        // roll previous buffered changes
        if (this.buffer.hasChanged) {
          forEach(bufferedAccountList, (currentBufferedAccount) => {
            const buffer = find(this.buffer.changes, {
              primaryEmailAddress: currentBufferedAccount.primaryEmailAddress,
            });

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

        return {
          data: bufferedAccountList,
          meta: {
            currentOffset: offset,
            pageCount: Math.ceil(accounts.count / pageSize),
            totalCount: accounts.count,
            pageSize,
          },
        };
      })
      .catch((failure) => {
        this.goBack(
          `${this.$translate.instant(
            'exchange_tab_ACCOUNTS_error_message',
          )} ${failure}`,
          'danger',
        );
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
    const matchingAccount = find(this.bufferedAccounts.list.results, {
      primaryEmailAddress,
    });

    if (period !== this.buffer.periodSelectedForAll) {
      this.buffer.periodSelectedForAll = null;
    }

    if (matchingAccount != null) {
      matchingAccount.renewPeriod = period;

      this.checkForChanges();
    }

    if (
      this.bufferedAccounts.list.results.every(
        ({ renewPeriod }) => renewPeriod === period,
      )
    ) {
      this.buffer.periodSelectedForAll = period;
    }
  }

  submit() {
    this.submitLoader = true;

    return this.updateRenew(this.buffer.changes)
      .then(({ state }) => {
        const updateRenewMessages = {
          OK: this.$translate.instant(
            'exchange_update_billing_periode_success',
          ),
          PARTIAL: this.$translate.instant(
            'exchange_update_billing_periode_partial',
          ),
          ERROR: this.$translate.instant(
            'exchange_update_billing_periode_failure',
          ),
        };

        this.goBack(updateRenewMessages[state]);
      })
      .catch((failure) => {
        this.goBack(
          `${this.$translate.instant(
            'exchange_update_billing_periode_failure',
          )} ${failure}`,
          'danger',
        );
      })
      .finally(() => {
        this.submitLoader = false;
      });
  }
}
