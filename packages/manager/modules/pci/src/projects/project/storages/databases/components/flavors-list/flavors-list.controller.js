import capitalize from 'lodash/capitalize';

export default class {
  constructor() {
    this.capitalize = capitalize;
  }

  getSortedFlavors() {
    return this.flavors?.sort((a, b) => b.compare(a));
  }

  isDisabled(flavor) {
    return (
      !this.allowLowerSelection &&
      this.currentFlavor &&
      this.currentFlavor.compare(flavor) < 0
    );
  }

  handleClick(flavor) {
    if (this.isDisabled(flavor)) return;
    this.selectedFlavor = flavor;
    this.onChange({ selectedFlavor: flavor });
  }
}
