import assign from 'lodash/assign';
import filter from 'lodash/filter';
import find from 'lodash/find';
import pick from 'lodash/pick';

export default class {
  /* @ngInject */
  constructor($q, $rootScope, $translate, DedicatedCloud) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
  }

  $onInit() {
    this.loaders = {
      loading: true,
      checks: {
        nsx: true,
        vrops: true,
        trustedIp: true,
        restrictedAccess: true,
        user: true,
        userPhoneNumber: true,
        userMail: true,
        userTokenValidator: true,
      },
    };

    this.checks = {};
  }

  applyCheck(promise, checkName) {
    return promise
      .then((checkResult) => {
        this.checks[checkName] = checkResult;
        return checkResult;
      })
      .finally(() => {
        this.loaders.checks[checkName] = false;
      });
  }

  checkOption(optionName) {
    return this.DedicatedCloud.getOptionState(optionName, this.productId).then(
      (result) => {
        if (result.error) {
          this.setMessage(
            `${this.$translate.instant(
              'dedicatedCloud_options_check_error',
            )} ${result.error.message || result.error}`,
            'danger',
          );
        }
        return result === 'enabled';
      },
    );
  }

  checkRestrictedAccess() {
    return this.DedicatedCloud.getSecurityInformations(this.productId).then(
      (result) => {
        this.userAccessPolicy = result.userAccessPolicy;
        return result.userAccessPolicy === 'FILTERED';
      },
    );
  }

  checkTrustedIp() {
    return this.DedicatedCloud.getSecurityPolicies(
      this.productId,
      null,
      null,
      true,
    ).then((policies) => {
      this.listIp = policies.list.results;
      return policies.list.results.some(
        (network) => network.status === 'ALLOWED',
      );
    });
  }

  loadUsers() {
    return this.DedicatedCloud.getUsers(this.productId).then((ids) =>
      this.$q.all(
        ids.map((id) => this.DedicatedCloud.getUserDetail(this.productId, id)),
      ),
    );
  }

  checkUser() {
    return this.loadUsers()
      .then((users) => {
        this.users = filter(users, { isTokenValidator: true });
        return find(users, { name: 'admin' });
      })
      .then((adminUser) => {
        if (!adminUser) {
          return false;
        }
        this.checks.userPhoneNumber = !!adminUser.phoneNumber;
        this.checks.userMail = !!adminUser.email;
        this.checks.userTokenValidator = !!adminUser.isTokenValidator;
        return (
          !!adminUser.phoneNumber &&
          !!adminUser.email &&
          !!adminUser.isTokenValidator
        );
      })
      .then((result) => {
        this.checks.user = result;
        return result;
      })
      .finally(() => {
        this.loaders.checks.user = false;
        this.loaders.checks.userPhoneNumber = false;
        this.loaders.checks.userMail = false;
        this.loaders.checks.userTokenValidator = false;
      });
  }

  canEnableOption() {
    return this.DedicatedCloud.isOptionToggable(
      this.productId,
      this.optionName,
      'disabled',
      false,
    );
  }

  checkOptions() {
    return this.$q.all([
      this.applyCheck(this.checkOption('nsx'), 'nsx'),
      this.applyCheck(this.checkOption('vrops'), 'vrops'),
    ]);
  }

  checkAccess() {
    return this.$q.all([
      this.applyCheck(this.checkRestrictedAccess(), 'restrictedAccess'),
      this.applyCheck(this.checkTrustedIp(), 'trustedIp'),
    ]);
  }

  checkCompliance() {
    this.loaders.loading = true;
    return this.$q
      .all([this.checkUser(), this.canEnableOption()])
      .then((results) => {
        this.loaders.loading = false;
        if (results[1].oldCommercialVersion) {
          // eslint-disable-next-line prefer-destructuring
          this.commercialRanges = results[1];
        }
      });
  }

  optionCanBeEnabled() {
    return this.commercialRanges && !this.commercialRanges.error;
  }

  getCheckItemClass(item) {
    if (this.loaders.checks[item]) {
      return 'checklist__item_loading';
    }

    return this.checks[item]
      ? 'checklist__item_success'
      : 'checklist__item_failure';
  }

  getItemStatusText(item) {
    if (this.checks[item]) {
      return 'dedicatedCloud_options_security_enabled';
    }
    return 'dedicatedCloud_options_security_disabled';
  }

  loadPrices() {
    this.loaders.loading = true;
    return this.DedicatedCloud.getSelected(this.productId)
      .then((pcc) =>
        this.DedicatedCloud.fetchAllHostsPrices(
          this.productId,
          this.commercialRanges.oldCommercialVersion,
          this.commercialRanges.newCommercialVersion,
          pcc.location,
        ),
      )
      .then((data) => {
        this.prices = data.current.map((host, index) =>
          assign(pick(host, ['datacenter', 'name', 'billingType']), {
            current: host.price,
            next: data.next[index].price,
          }),
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_options_load_prices_error',
          )} ${err.message || err}`,
          'danger',
        );
      })
      .finally(() => {
        this.loaders.loading = false;
      });
  }

  subscribeOption() {
    this.loaders.loading = true;

    this.DedicatedCloud.enableOption(this.productId, this.optionName)
      .then((result) => {
        this.goBack(
          this.$translate.instant(
            'dedicatedCloud_options_order_activate_success',
          ),
        );
        this.$rootScope.$broadcast('option-enable', {
          optionName: this.optionName,
          taskId: result.taskId,
        });
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_options_order_activate_error',
          )} ${err.message || err}`,
          'danger',
        );
      });
  }
}
