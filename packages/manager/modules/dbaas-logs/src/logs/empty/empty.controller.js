import placeholder from '../../assets/placeholder.png';

export default class {
  constructor() {
    this.placeholder = placeholder;
  }

  onGuideLinkClick(guide) {
    this.onGuideClick({ guide });
  }
}
