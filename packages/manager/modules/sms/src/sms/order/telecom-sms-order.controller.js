import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import set from 'lodash/set';
import toArray from 'lodash/toArray';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $filter,
    $state,
    $stateParams,
    atInternet,
    TucSmsMediator,
    OvhApiOrder,
    tucDebounce,
    TucToast,
    SMS_ORDER_PREFIELDS_VALUES,
    SMS_ORDER_ACCOUNT_TYPE_VALUES,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$filter = $filter;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.TucSmsMediator = TucSmsMediator;
    this.api = {
      order: {
        sms: OvhApiOrder.Sms().v6(),
      },
    };
    this.tucDebounce = tucDebounce;
    this.TucToast = TucToast;
    this.constant = {
      SMS_ORDER_PREFIELDS_VALUES,
    };
    this.SMS_ORDER_ACCOUNT_TYPE_VALUES = SMS_ORDER_ACCOUNT_TYPE_VALUES;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.needGuidesMenu = this.$state.current.name === 'sms.order';
    this.loading = {
      init: false,
      order: false,
      prices: false,
    };
    this.order = {
      account: null,
      credit: null,
      channel: null,
      customCredit: 100,
      max: 1000000,
      min: 100,
    };
    this.contracts = null;
    this.contractsAccepted = false;
    this.availableAccounts = null;
    this.availableCredits = null;

    this.availableCredits = [];
    forEach(this.constant.SMS_ORDER_PREFIELDS_VALUES, (value, idx) => {
      this.availableCredits.push({
        label: isNaN(value)
          ? this.$translate.instant('sms_order_credit_custom')
          : this.$filter('number')(value),
        value,
      });
      if (value === this.order.min) {
        this.order.credit = this.availableCredits[idx];
      }
    });

    this.loading.init = true;
    this.TucSmsMediator.initAll()
      .then(() => {
        const availableAccounts = toArray(this.TucSmsMediator.getAccounts());

        // We have to format it to become human readable
        forEach(availableAccounts, (account, idx) => {
          // if no description, take sms id
          if (account.description === '') {
            set(account, 'label', account.name);
          } else if (account.description !== account.name) {
            set(account, 'label', `${account.description} (${account.name})`);
          } else {
            set(account, 'label', account.name);
          }

          // If we are on a service, preselect
          if (account.name === this.$stateParams.serviceName) {
            this.order.account = availableAccounts[idx];
            this.order.channel = availableAccounts[idx].channel;
          }
        }).sort((a, b) => a.label.localeCompare(b.label));

        const newAccount = {
          name: 'new',
          description: '',
          label: this.$translate.instant('sms_order_new_account'),
        };
        availableAccounts.push(newAccount);
        this.availableAccounts = availableAccounts;
        if (!this.order.account) {
          this.order.account = this.availableAccounts[
            this.availableAccounts.length - 1
          ];
        }
      })
      .then(() => this.getPrices())
      .finally(() => {
        this.loading.init = false;
      });

    this.getDebouncedPrices = this.tucDebounce(
      () => this.getPrices(),
      500,
      false,
    );
  }

  /**
   * Is account creation.
   * @return {Boolean}
   */
  isAccountCreation() {
    return this.order.account.name === 'new';
  }

  /**
   * Custom credit selected.
   * @return {Boolean}
   */
  customCreditSelected() {
    return (
      this.order.credit.label &&
      this.order.credit.label ===
        this.$translate.instant('sms_order_credit_custom')
    );
  }

  /**
   * Get selected credit.
   * @return {String}
   */
  getSelectedCredit() {
    if (this.customCreditSelected()) {
      return this.order.customCredit;
    }
    return this.order.credit.value;
  }

  /**
   * Get prices.
   * @return {Promise}
   */
  getPrices() {
    this.loading.prices = true;
    this.contracts = null;
    this.prices = null;
    this.contractsAccepted = false;
    this.order.channel = this.order.account.channel;
    if (this.isAccountCreation()) {
      return this.api.order.sms
        .getNewSmsAccount({
          quantity: this.getSelectedCredit(),
        })
        .$promise.then((newAccountPriceDetails) => {
          this.contracts = newAccountPriceDetails.contracts;
          this.prices = newAccountPriceDetails;
          return this.prices;
        })
        .catch((error) => {
          this.TucToast.error(this.$translate.instant('sms_order_ko'));
          return this.$q.reject(error);
        })
        .finally(() => {
          this.loading.prices = false;
        });
    }
    return this.api.order.sms
      .getCredits({
        serviceName: this.order.account.name,
        quantity: this.getSelectedCredit(),
      })
      .$promise.then((priceDetails) => {
        this.contracts = priceDetails.contracts;
        this.prices = priceDetails;
      })
      .catch(() => this.TucToast.error(this.$translate.instant('sms_order_ko')))
      .finally(() => {
        this.loading.prices = false;
      });
  }

  /**
   * Do order.
   * @return {Promise}
   */
  doOrder() {
    this.atInternet.trackClick({
      name: `sms::order::generate_order-${
        this.order.channel
      }-${this.getSelectedCredit()}`,
      type: 'action',
    });

    this.loading.order = true;
    this.prices.url = null;
    if (this.isAccountCreation()) {
      return this.api.order.sms
        .orderNewSmsAccount(
          {},
          {
            quantity: this.getSelectedCredit(),
            channel: this.order.channel,
            smpp: ['transactional', 'marketing'].includes(this.order.channel),
          },
        )
        .$promise.then((newAccountPriceDetails) => {
          this.prices.url = newAccountPriceDetails.url;
          return this.prices.url;
        })
        .catch(() =>
          this.TucToast.error(this.$translate.instant('sms_order_ko')),
        )
        .finally(() => {
          this.loading.order = false;
        });
    }
    return this.api.order.sms
      .orderCredits(
        {
          serviceName: this.order.account.name,
        },
        {
          quantity: this.getSelectedCredit(),
        },
      )
      .$promise.then((priceDetails) => {
        this.prices.url = priceDetails.url;
      })
      .catch(() => this.TucToast.error(this.$translate.instant('sms_order_ko')))
      .finally(() => {
        this.loading.order = false;
      });
  }
}
