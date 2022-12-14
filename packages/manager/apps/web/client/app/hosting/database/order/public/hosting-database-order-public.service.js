import sortBy from 'lodash/sortBy';
import toNumber from 'lodash/toNumber';
import { PRODUCT_NAME } from './hosting-database-order-public.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    OvhApiHostingWeb,
    OvhApiOrder,
    OvhApiOrderCatalogPublic,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.OvhApiHostingWeb = OvhApiHostingWeb;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  computeCharacteristics(characteristicsOfAvailableProducts) {
    return characteristicsOfAvailableProducts.map((characteristics) => ({
      display: this.$translate.instant(
        characteristics.quantity === 1
          ? 'ovhManagerHostingDatabaseOrderPublic_customization_characteristics_display_1'
          : 'ovhManagerHostingDatabaseOrderPublic_customization_characteristics_display_+',
        {
          diskSpace: characteristics.diskSpace,
          quantity: characteristics.quantity,
        },
      ),
      characteristics,
    }));
  }

  static buildPlanCode(diskSpace, quantity) {
    return `sql_perso_${diskSpace}_${quantity}`;
  }

  getCharacteristicsOfAllProducts(serviceName) {
    return this.OvhApiOrder.CartServiceOption()
      .v6()
      .get({
        productName: PRODUCT_NAME,
        serviceName,
      })
      .$promise.then((products) =>
        sortBy(
          products
            .filter((product) => product.planCode.startsWith('sql_perso'))
            .map((product) => {
              const [, , diskSpace, quantity] = product.planCode.split('_');

              return {
                diskSpace: toNumber(diskSpace),
                quantity: toNumber(quantity),
              };
            }),
          ['diskSpace', 'quantity'],
        ),
      );
  }

  getUnavailableDiskSpaces(serviceName) {
    return this.OvhApiHostingWeb.ExtraSqlPerso()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((extraSqls) =>
        extraSqls.map((extra) => toNumber(extra.match(/\d+/)[0])),
      );
  }

  getCharacteristicsOfAvailableProducts(serviceName) {
    return this.$q
      .all([
        this.getCharacteristicsOfAllProducts(serviceName),
        this.getUnavailableDiskSpaces(serviceName),
      ])
      .then(([characteristicsOfAllProducts, unavailableDiskSpaces]) => {
        return characteristicsOfAllProducts.filter(
          (product) =>
            !unavailableDiskSpaces.some(
              (diskSpace) => product.diskSpace === diskSpace,
            ),
        );
      });
  }
}
