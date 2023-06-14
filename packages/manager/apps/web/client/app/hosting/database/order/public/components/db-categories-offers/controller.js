import { UCENTS_FACTOR } from './constants';

export default class WebHostingDatabaseOrderComponentsDbCategoriesOffersController {
  $onInit() {
    // preselect equal offer (if exist)
    this.model = {
      dbCategory: this.getDbCategoryToPreselect(),
    };
  }

  getDbCategoryToPreselect() {
    return this.dbCategories.find(({ category }) => {
      return this.preselectDbCategory === category;
    });
  }

  getDbEngines() {
    return this.model.dbCategory?.selectVersion?.engines || [];
  }

  getDbVersionPrice(dbCategoryVersion) {
    const price = dbCategoryVersion?.pricings?.find(
      ({ interval }) => interval === 12,
    );
    const computePrice = ((price.price - price.tax) / UCENTS_FACTOR).toFixed(2);

    return `${computePrice} ${this.user.currency.symbol}`;
  }
}
