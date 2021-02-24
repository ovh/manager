import placeholder from './placeholder.png';

export default class {
  constructor() {
    this.placeholder = placeholder;
  }

  onGuideLinkClick(guide) {
    this.onGuideClick({ guide });
  }
}
