export default class TopbarCtaController {
  constructor() {
    this.TOPBAR_OPTIONS = {
      CTA_TYPE_SINGLE: 'button',
      CTA_TYPE_MULTI: 'actions',
    };
  }

  isSingleCta() {
    const { type, displayed } = this.options?.cta || {};

    return type === this.TOPBAR_OPTIONS.CTA_TYPE_SINGLE && displayed;
  }

  isMenuActionsCta() {
    const { type, displayed } = this.options?.cta || {};

    return type === this.TOPBAR_OPTIONS.CTA_TYPE_MULTI && displayed;
  }
}
