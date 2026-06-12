import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

export default class VpsOrderDiskCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    atInternet,
    catalog,
    coreConfig,
    CucCloudMessage,
    connectedUser,
    OvhApiOrder,
    stateVps,
    goBack,
    RedirectionService,
  ) {
    // dependencies injections
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.catalog = catalog;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.connectedUser = connectedUser;
    this.OvhApiOrder = OvhApiOrder;
    this.stateVps = stateVps;
    this.goBack = goBack;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');

    // other attributes used in view
    this.chunkedDiskOptions = null;
    this.getDiskMonthlyPrice = VpsOrderDiskCtrl.getDiskMonthlyPrice;

    this.loading = {
      init: false,
    };

    this.model = {
      disk: null,
    };
  }

  static getDiskMonthlyPrice(disk) {
    const price = find(disk.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    return get(price, 'price');
  }

  static getDiskDuration(disk) {
    const price = find(disk.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    return price?.duration;
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onAdditionalDiskOrderStepperFinish() {
    this.atInternet.trackClick({
      name: `vps::detail::additional-disk::order::confirm_${this.model.disk?.capacity?.value}`,
      type: 'action',
    });

    const priceOptions = find(this.model.disk.prices, ({ capacities }) =>
      capacities.includes('renew'),
    );
    const expressParams = {
      productId: 'vps',
      serviceName: this.stateVps.name,
      planCode: this.model.disk.planCode,
      duration: priceOptions.duration,
      pricingMode: priceOptions.pricingMode,
      quantity: 1,
    };
    this.expressOrderUrl = `${this.expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(this.expressOrderUrl, '_blank', 'noopener');

    this.CucCloudMessage.success({
      textHtml: this.$translate.instant('vps_order_additional_disk_success', {
        url: this.expressOrderUrl,
      }),
    });

    return this.$onInit();
  }

  /* -----  End of EVENTS  ------ */

  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.init = true;
    this.model.disk = null;

    return this.OvhApiOrder.CartServiceOption()
      .Vps()
      .v6()
      .get({
        serviceName: this.stateVps.name,
      })
      .$promise.then((response) => {
        // first take the options from additionalDisk family
        let diskOptions = filter(response, {
          family: 'additionalDisk',
        });

        // then map the filtered options by adding a capacity attribute
        // this attribute is read from the catalog plan matching the planCode
        // (e.g. blobs.commercial.name = "10000 GB" -> 10000), with a fallback
        // parsing the planCode trailing size (e.g. "option-additional-disk-100g" -> 100)
        diskOptions = diskOptions.map((diskOption) => {
          const plan = this.catalog?.plans?.find(
            ({ planCode }) => planCode === diskOption.planCode,
          );
          set(diskOption, 'capacity', {
            value:
              parseInt(
                plan?.blobs?.commercial?.name?.replace(/[^\d]/g, ''),
                10,
              ) ||
              parseInt(diskOption.planCode.match(/-(\d+)g$/)?.[1], 10) ||
              0,
            unit: 'Go',
          });

          return diskOption;
        });

        // order disk by their size
        diskOptions = sortBy(diskOptions, 'capacity.value');

        // set chunked disk options to use in view
        this.chunkedDiskOptions = chunk(diskOptions, 3);
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vps_order_additional_disk_load_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
