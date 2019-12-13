export default class CuiAccordionCtrl {
  $onInit() {
    if (!this.expanded && this.expanded !== false) {
      this.expanded = false;
    }

    if (!this.ariaLabel) {
      this.ariaLabel = 'Actions';
    }
  }

  toggle() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
  }
}
