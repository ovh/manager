export default class {
  formatTracker(universe, product) {
    return `${this.trackingPrefix}::catalog::${universe
      .toLowerCase()
      .replace(' ', '-')}::${product.productName
      .toLowerCase()
      .replace(/_/g, '-')}::order`;
  }
}
