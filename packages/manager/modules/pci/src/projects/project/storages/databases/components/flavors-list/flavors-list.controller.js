import capitalize from 'lodash/capitalize';

export default class {
  constructor() {
    this.capitalize = capitalize;
  }

  $onInit() {
    this.flavors = this.flavors.sort((a, b) => b.compare(a));
  }
}
