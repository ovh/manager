import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import range from 'lodash/range';
import remove from 'lodash/remove';
import slice from 'lodash/slice';
import some from 'lodash/some';

angular.module('controllers').controller(
  'DomainDnssecTabCtrl',
  class DomainDnssecTabCtrl {
    constructor(
      $scope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      Domain,
      constants,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.constants = constants;
    }

    $onInit() {
      this.const = {
        ALGORITHM_OPTIONS: this.constants.algorithm_options,
        ALTERABLE_DNSSEC_SERVER_TYPE: 'EXTERNAL',
        FLAGS_OPTIONS: this.constants.flags_options,
        MAX_AMOUNT_DNSSEC: 4,
        PUBLIC_KEY_REGEX: null,
        TAG_MIN: 1,
        TAG_MAX: 65536,
      };
      this.editMode = false;
      this.loading = false;
      this.product = null;

      this.$scope.$on('domain.tabs.dnssec.save', () =>
        this.saveModifications(),
      );

      this.loadDnssec();
    }

    isModifiable() {
      if (!this.product) {
        return false;
      }
      return (
        this.product.nameServerType ===
          this.const.ALTERABLE_DNSSEC_SERVER_TYPE &&
        !this.product.managedByOvh &&
        !this.hasActiveTask
      );
    }

    isNotModifiableByActiveTask() {
      if (!this.product) {
        return false;
      }
      return (
        this.product.nameServerType ===
          this.const.ALTERABLE_DNSSEC_SERVER_TYPE &&
        !this.product.managedByOvh &&
        this.hasActiveTask &&
        this.product.dnssecSupported
      );
    }

    loadDnssec() {
      this.loading = true;
      this.dnssecListSave = [];
      this.keyAlgorithmEnum = [];
      this.keyFlagEnum = [];

      return this.$q
        .all({
          product: this.Domain.getSelected(this.$stateParams.productId),
          pendingTasks: this.getPendingTasks(this.$stateParams.productId),
          dnsSecs: this.getDnsSecs(this.$stateParams.productId),
          models: this.Domain.getDomainModels(),
        })
        .then(({ product, models }) => {
          this.product = product;
          this.keyAlgorithmEnum = map(
            models.models['dnssec.KeyAlgorithmEnum'].enum,
            (algorithm) => +algorithm,
          );
          this.keyFlagEnum = map(
            models.models['dnssec.KeyFlagEnum'].enum,
            (flag) => +flag,
          );
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_DNSSEC_loading_error'),
            get(err, 'data', err),
            this.$scope.alerts.tabs,
          ),
        )
        .finally(() => {
          this.dnssecListSave = slice(this.dnssecList);
          this.loading = false;
        });
    }

    getDnsSecs(domain) {
      this.dnssecList = [];
      return this.Domain.getDnssecList(domain).then((dnssecList) =>
        this.$q.all(
          map(dnssecList, (dnsSecName) =>
            this.Domain.getDnssec(domain, dnsSecName).then((dnssec) =>
              this.dnssecList.push(dnssec),
            ),
          ),
        ),
      );
    }

    static getLabel(key, options) {
      const option = find(
        options,
        (currentOption) => currentOption.value === key,
      );
      if (!option) {
        return key;
      }
      return option.label;
    }

    getPendingTasks(domain) {
      this.hasActiveTask = 0;
      forEach(['todo', 'doing', 'error'], (status) =>
        this.Domain.getDomainPendingTasks(domain, {
          function: 'DomainDnsUpdate',
          status,
        }).then((tasks) => {
          this.hasActiveTask += tasks.length > 0 ? 1 : 0;
        }),
      );
    }

    addRecord() {
      this.dnssecList.push({
        id: this.nextAvailableId(),
        tag: 0,
        flags: null,
        algorithm: null,
        publicKey: null,
      });
    }

    nextAvailableId() {
      return find(
        range(this.const.MAX_AMOUNT_DNSSEC),
        (id) => !some(this.dnssecList, { id }),
      );
    }

    deleteRecord(dnssec) {
      remove(this.dnssecList, dnssec);
    }

    reset() {
      this.dnssecList = slice(this.dnssecListSave);
      this.editMode = false;
    }

    hasValidChanges() {
      if (this.dnssecList.length < this.dnssecListSave.length) {
        return !this.addDnssecForm.$invalid;
      }
      return (
        this.addDnssecForm.$dirty &&
        !this.addDnssecForm.$invalid &&
        this.dnssecList.length > 0
      );
    }

    saveModifications() {
      this.loading = true;
      return this.Domain.saveDnssecList(this.product.name, {
        keys: this.dnssecList,
      })
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_tab_DNSSEC_action_add_success'),
            this.$scope.alerts.tabs,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_DNSSEC_action_add_error'),
            err,
            this.$scope.alerts.tabs,
          ),
        )
        .finally(() => this.loadDnssec());
    }
  },
);
