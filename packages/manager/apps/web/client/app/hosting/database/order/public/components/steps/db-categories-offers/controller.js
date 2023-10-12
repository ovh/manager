import { UCENTS_FACTOR } from './constants';

export default class WebHostingDatabaseOrderComponentsDbCategoriesOffersController {
  $onInit() {
    // preselect equal offer (if exist)
    this.model = {
      dbCategory: {
        ...(this.preselectDbCategory && this.getDbCategoryToPreselect()),
      },
    };
  }

  getDbCategoryToPreselect() {
    return this.dbCategories.find(({ category }) => {
      return this.preselectDbCategory === category;
    });
  }

  getDbEngines() {
    const engines = this.model.dbCategory?.selectVersion?.engines;
    if (engines && engines.length) {
      angular.forEach(engines, (engine) => {
        engine.versions.sort((a, b) => {
          // Order versions in descending order
          return b.dbVersion.localeCompare(a.dbVersion, undefined, {
            numeric: true,
          });
        });
      });
    }
    return engines || [];
  }

  getDbVersionPrice(dbCategoryVersion) {
    const pricePerMonth = dbCategoryVersion?.pricings?.find(
      ({ interval }) => interval === 1,
    )?.price;
    // used as fallback
    const pricePerYear =
      dbCategoryVersion?.pricings?.find(({ interval }) => interval === 12)
        ?.price / 12;

    const price = (pricePerMonth || pricePerYear) / UCENTS_FACTOR;

    return `${price.toFixed(2)} ${this.user.currency?.symbol || ''}`;
  }
}
