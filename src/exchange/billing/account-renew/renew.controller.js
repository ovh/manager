import _ from 'lodash';
import { RENEW_PERIODS } from './renew.constants';

export default class ExchangeUpdateRenewCtrl {
  /* @ngInject */
  constructor(
    $translate,
  ) {
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
    const bufferedAccountList = _.get(this.bufferedAccounts, 'list.results', []);

    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    this.displayDeleteWarning = false;

    _.forEach(bufferedAccountList, (bufferedAccount) => {
      const currentAccount = _(this.accounts.list.results).find({
        primaryEmailAddress: bufferedAccount.primaryEmailAddress,
      });

      if (currentAccount.renewPeriod !== bufferedAccount.renewPeriod) {
        this.bufferChanges(bufferedAccount);

        if (bufferedAccount.renewPeriod === 'DELETE_AT_EXPIRATION') {
          this.displayDeleteWarning = true;
        }
      } else {
        this.buffer.changes = this.buffer.changes.filter(
          change => change.primaryEmailAddress !== currentAccount.primaryEmailAddress,
        );
      }
    });

    this.buffer.hasChanged = !_.isEmpty(this.buffer.changes);
  }

  bufferChanges(account) {
    if (this.buffer.changes == null) {
      this.buffer.changes = [];
    }

    const accountInChange = _(this.buffer.changes).find({
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
    return _.get(_.find(criteria, { property }), 'value');
  }

  retrieveAccounts({ criteria, offset, pageSize }) {
    return this.getAccounts(
      pageSize,
      (offset - 1), // Avoid offset to start at 1
      ExchangeUpdateRenewCtrl.getCriterion(criteria, null),
    )
      .then((accounts) => {
        this.accounts = accounts;
        this.bufferedAccounts = _.cloneDeep(accounts);

        const bufferedAccountList = _.get(this.bufferedAccounts, 'list.results', []);

        this.buffer.ids = bufferedAccountList.map(item => item.primaryEmailAddress);

        // roll previous buffered changes
        if (this.buffer.hasChanged) {
          _.forEach(bufferedAccountList, (currentBufferedAccount) => {
            const buffer = _.find(this.buffer.changes, {
              primaryEmailAddress: currentBufferedAccount.primaryEmailAddress,
            });

            if (buffer != null) {
              _.set(currentBufferedAccount, 'renewPeriod', buffer.renewPeriod);
            }
          });
        }

        // needed by selectAll checkbox
        _.forEach(bufferedAccountList, (account) => {
          this.trackSelected(account.primaryEmailAddress, account.renewPeriod);
        });

        _.set(this.bufferedAccounts, 'list.results', bufferedAccountList);

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
          `${this.$translate.instant('exchange_tab_ACCOUNTS_error_message')} ${failure}`,
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
    if (_.has(this.buffer, 'ids') && this.buffer.ids != null) {
      _.forEach(this.buffer.ids, (id) => {
        this.trackSelected(id, value);
      });
    }
  }

  trackSelected(primaryEmailAddress, period) {
    const matchingAccount = _(this.bufferedAccounts.list.results).find({
      primaryEmailAddress,
    });

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

    return this.updateRenew(this.buffer.changes)
      .then(({ state }) => {
        const updateRenewMessages = {
          OK: this.$translate.instant('exchange_update_billing_periode_success'),
          PARTIAL: this.$translate.instant('exchange_update_billing_periode_partial'),
          ERROR: this.$translate.instant('exchange_update_billing_periode_failure'),
        };

        this.goBack(updateRenewMessages[state]);
      })
      .catch((failure) => {
        this.goBack(
          `${this.$translate.instant('exchange_update_billing_periode_failure')} ${failure}`,
          'danger',
        );
      })
      .finally(() => {
        this.submitLoader = false;
      });
  }
}
