import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import {
  BACKUP_PROPERTIES_MAP,
  BACKUP_OFFER_LEGACY,
  CATALOG_INFO,
} from './backup.constants';
import Backup from './backup.class';
import BackupOffer from './backup-offer.class';

export default class BackupService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    OvhApiDedicatedCloudDatacenter,
    OvhApiOrder,
    WucOrderCartService,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.backupApi = OvhApiDedicatedCloudDatacenter.Backup().v6();
    this.cartApi = OvhApiOrder.Cart().v6();
    this.WucOrderCartService = WucOrderCartService;
  }

  addConfigToCart(cartItem, datacenterId, offerType) {
    return this.$q
      .all([
        this.WucOrderCartService.addConfigurationItem(
          cartItem.cartId,
          cartItem.itemId,
          'datacenter_id',
          datacenterId,
        ),
        this.WucOrderCartService.addConfigurationItem(
          cartItem.cartId,
          cartItem.itemId,
          'offer_type',
          offerType,
        ),
      ])
      .then(() => cartItem);
  }

  assignCart(cart) {
    return this.WucOrderCartService.assignCart(cart.cartId).then(() => cart);
  }

  checkoutCart(cart, autoPayWithPreferredPaymentMethod) {
    return this.cartApi.checkout(
      { cartId: cart.cartId },
      { autoPayWithPreferredPaymentMethod },
    ).$promise;
  }

  getOrderableBackupOption(productId) {
    return this.WucOrderCartService.getProductServiceOptions(
      'privateCloud',
      productId,
    ).then((addons) =>
      find(addons, { family: CATALOG_INFO.ADDON_FAMILY_NAME }),
    );
  }

  addOptionToCart(option, cart, productId) {
    const price = find(get(option, 'prices'), (priceObj) => {
      return includes(get(priceObj, 'capacities'), 'installation');
    });
    return this.WucOrderCartService.addProductServiceOptionToCart(
      cart.cartId,
      'privateCloud',
      productId,
      {
        duration: get(price, 'duration'),
        planCode: get(option, 'planCode'),
        pricingMode: get(price, 'pricingMode'),
        quantity: 1,
      },
    );
  }

  createBackupOrder(ovhSubsidiary, productId, datacenterId, offerType) {
    return this.WucOrderCartService.createNewCart(ovhSubsidiary)
      .then((cart) => this.assignCart(cart))
      .then((cart) =>
        this.getOrderableBackupOption(productId).then((option) => ({
          option,
          cart,
        })),
      )
      .then(({ option, cart }) => this.addOptionToCart(option, cart, productId))
      .then((cartItem) =>
        this.addConfigToCart(cartItem, datacenterId, offerType),
      )
      .then((cartItem) =>
        this.WucOrderCartService.getCheckoutInformations(
          cartItem.cartId,
        ).then((checkoutInfo) => ({ ...checkoutInfo, cartItem })),
      );
  }

  getBackup(serviceName, datacenterId) {
    return this.backupApi
      .get({ serviceName, datacenterId })
      .$promise.then((backup) => new Backup(backup));
  }

  getOfferCapabilities(serviceName, datacenterId) {
    return this.backupApi.offerCapabilities({ serviceName, datacenterId })
      .$promise;
  }

  getCatalog(ovhSubsidiary) {
    return this.$http
      .get('/sws/dedicatedcloud/catalog', {
        serviceType: 'aapi',
        params: {
          ovhSubsidiary,
        },
      })
      .then((data) => get(data, 'data'));
  }

  getBackupOffers(serviceName, datacenterId, ovhSubsidiary) {
    return this.$q
      .all([
        this.getOfferCapabilities(serviceName, datacenterId),
        this.getCatalog(ovhSubsidiary),
      ])
      .then(([backupOffers, catalog]) =>
        sortBy(
          BackupService.transformBackupOffers(backupOffers, catalog),
          'price',
        ),
      );
  }

  updateBackupCapabilities(serviceName, datacenterId, backup) {
    return this.backupApi.changeProperties(
      { serviceName, datacenterId },
      pick(backup, get(BACKUP_PROPERTIES_MAP, backup.backupOffer)),
    ).$promise;
  }

  disableBackup(serviceName, datacenterId) {
    return this.backupApi.disable({ serviceName, datacenterId }, {}).$promise;
  }

  static getAddonsByAddonFamily(plan, family) {
    return get(find(get(plan, 'addonsFamily'), { family }), 'addons');
  }

  static transformBackupOffers(backupOffers, catalog) {
    remove(backupOffers, (offer) => offer.offerName === BACKUP_OFFER_LEGACY);
    return map(backupOffers, (offer) => {
      const backupManagedAddon = find(
        BackupService.getAddonsByAddonFamily(
          get(catalog, 'plans[0]'),
          CATALOG_INFO.ADDON_FAMILY_NAME,
        ),
        (addon) => get(addon, 'plan.planCode') === CATALOG_INFO.ADDON_PLAN_CODE,
      );
      const backupJobOfferAddons = BackupService.getAddonsByAddonFamily(
        get(backupManagedAddon, 'plan'),
        CATALOG_INFO.ADDON_BACKUP_JOB_OFFER_FAMILY_NAME,
      );
      return new BackupOffer({
        ...offer,
        price: get(
          find(
            backupJobOfferAddons,
            (addon) =>
              get(addon, 'plan.planCode') ===
              `pcc-option-backup-managed-${offer.offerName}-s`,
          ),
          'plan.details.pricings.pcc-servicepack-default[0].priceInUcents',
        ),
      });
    });
  }
}
