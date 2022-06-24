import capitalize from 'lodash/capitalize';

export default class {
  constructor() {
    this.capitalize = capitalize;
  }

  getSortedFlavors() {
    return this.flavors?.sort((a, b) => b.compare(a));
  }
}
