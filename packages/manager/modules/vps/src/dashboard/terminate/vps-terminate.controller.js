export default class {
  static getDegressivityMonthDetails(degressivityInformation) {
    const [price] = degressivityInformation.prices;
    const [degressivityMonth] = price.pricingMode.match(/\d+/g);
    return degressivityMonth;
  }

  terminate() {
    this.isTerminating = true;
    return this.confirm();
  }
}
