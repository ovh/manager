import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

import config from '../../../../config/config';

angular.module('App').controller(
  'ovhManagerPccDatacenterBackupEnable',
  class {
    /* @ngInject */
    constructor(
      $q,
      $state,
      $stateParams,
      $translate,
      $window,
      Alerter,
      ovhManagerPccDatacenterBackupEnableService,
      DedicatedCloud,
      User,
    ) {
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.ovhManagerPccDatacenterBackupEnableService = ovhManagerPccDatacenterBackupEnableService;
      this.DedicatedCloud = DedicatedCloud;
      this.User = User;
    }

    $onInit() {
      this.bindings = {
        availableHosts: {
          value: undefined,
          warning: {
            isDisplayed: undefined,
            text: undefined,
          },
        },
        availableOffers: {
          value: undefined,
          selection: {
            value: undefined,
          },
          warning: {
            canExist: undefined,
            isDisplayed: undefined,
            text: undefined,
          },
        },
        isFetchingInitialData: undefined,
        labels: {
          primary: undefined,
          secondary: undefined,
        },
        isWarning: undefined,
      };

      return this.fetchInitialData();
    }

    fetchInitialData() {
      this.bindings.isFetchingInitialData = true;

      return this.$q
        .all({
          currentService: this.DedicatedCloud.getSelected(
            this.$stateParams.productId,
            true,
          ),
          datacenter: this.DedicatedCloud.getDatacenterInfoProxy(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
          ),
          expressURL: this.User.getUrlOf('express_order'),
          hosts: this.DedicatedCloud.getHosts(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
          ),
          user: this.User.getUser(),
        })
        .then(({ currentService, datacenter, expressURL, hosts, user }) => {
          this.currentService = currentService;
          this.datacenter = datacenter;
          this.expressURL = expressURL;
          this.updateAvailableHosts(hosts);
          this.user = user;
          const urlBaseToUse =
            get(config.constants.URLS, this.user.ovhSubsidiary) ||
            config.constants.URLS.FR;
          this.veeamPresentationURL = urlBaseToUse.presentations.veeam;
        })
        .then(() =>
          this.user.ovhSubsidiary === 'US'
            ? this.ovhManagerPccDatacenterBackupEnableService.fetchBackupOffers(
                this.$stateParams.productId,
              )
            : null,
        )
        .then((offers) => {
          this.updateAvailableOffers(get(offers, 'prices'));
        })
        .then(() => {
          this.updateType();
          this.updatePrimaryLabel();
          this.updateSecondaryLabel();
        })
        .catch((error) => {
          this.Alerter.error(
            `${this.$translate.instant(
              'dedicatedCloud_tab_veeam_enable_fail',
            )}. ${get(error, 'message', '')}`.trim(),
          );
        })
        .finally(() => {
          this.bindings.isFetchingInitialData = false;
        });
    }

    updatePrimaryLabel() {
      this.bindings.labels.primary = this.bindings.isWarning
        ? this.$translate.instant('global_OK')
        : this.$translate.instant('dedicatedCloud_options_activate');
    }

    updateSecondaryLabel() {
      this.bindings.labels.secondary = this.bindings.isWarning
        ? null
        : this.$translate.instant('wizard_cancel');
    }

    updateType() {
      this.bindings.isWarning =
        this.bindings.availableHosts.warning.isDisplayed ||
        this.bindings.availableOffers.warning.isDisplayed;
    }

    updateAvailableHosts(availableHosts) {
      this.bindings.availableHosts.value = availableHosts;

      this.bindings.availableHosts.warning.isDisplayed =
        !isArray(availableHosts) || isEmpty(availableHosts);

      this.bindings.availableHosts.warning.text = this.bindings.availableHosts
        .warning.isDisplayed
        ? this.$translate.instant('dedicatedCloud_tab_veeam_on_disabled', {
            name: this.datacenter.name,
          })
        : '';
    }

    updateAvailableOffers(availableOffers) {
      this.bindings.availableOffers.value = availableOffers;

      this.bindings.availableOffers.warning.canExist =
        this.user.ovhSubsidiary === 'US';

      const isDisplayed =
        this.bindings.availableOffers.warning.canExist &&
        (!isArray(availableOffers) || isEmpty(availableOffers));
      this.bindings.availableOffers.warning.isDisplayed = isDisplayed;

      this.bindings.availableOffers.warning.text = this.bindings.availableOffers
        .warning.isDisplayed
        ? this.$translate.instant(
            'dedicatedCloud_datacenter_backup_enable_no_offer',
            { name: this.datacenter.name },
          )
        : null;

      this.bindings.availableOffers.selection.isDisplayed =
        isArray(availableOffers) && !isEmpty(availableOffers);

      this.bindings.availableOffers.selection.value = 'classic';
    }

    closeModal() {
      return this.$state.go('^');
    }

    submit() {
      if (this.bindings.isWarning) {
        return this.closeModal();
      }

      if (
        this.bindings.availableOffers.selection.isDisplayed &&
        !this.bindings.availableOffers.selection.value
      ) {
        return null;
      }

      const offerType = this.bindings.availableOffers.value
        ? this.bindings.availableOffers.selection.value
        : 'legacy';

      const productToOrder = {
        productId: 'privateCloud',
        serviceName: this.$stateParams.productId,
        planCode: 'pcc-option-backup-managed',
        duration: 'P1M',
        pricingMode: `pcc-servicepack-${this.currentService.servicePackName}`,
        quantity: 1,
        configuration: [
          {
            label: 'datacenter_id',
            value: this.datacenter.datacenterId,
          },
          {
            label: 'offer_type',
            value: offerType,
          },
        ],
      };

      const orderURL = `${this.expressURL}review?products=${JSURL.stringify([
        productToOrder,
      ])}`;

      this.$window.open(orderURL, '_blank');

      return this.closeModal();
    }
  },
);
