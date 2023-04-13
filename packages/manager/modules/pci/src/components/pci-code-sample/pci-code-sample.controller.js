import ClipboardJS from 'clipboard';
import hljs from 'highlight.js';

export default class PciCodeSampleCtrl {
  /* @ngInject */
  constructor($translate, $timeout, $element) {
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.$element = $element;
  }

  $onInit() {
    this.$timeout(() => {
      this.tooltip = this.$translate.instant('pci_code_sample_tooltip_copy');
      [this.trigger] = this.$element.find('.pci-code-sample-button');
      [this.target] = this.$element.find('.pci-code-sample-code');

      // Init clipboardJS
      this.clipboard = new ClipboardJS(this.trigger, {
        target: () => this.target,
        text: () => this.model,
      });
      // Higlight code
      this.highlight();
    });
  }

  $onDestroy() {
    this.clipboard.destroy();
  }

  highlight() {
    this.$timeout(() => {
      hljs.highlightElement(this.target);
    });
  }

  updateTooltip() {
    this.tooltip = this.$translate.instant('pci_code_sample_tooltip_copied');
    this.$timeout(() => {
      this.tooltip = this.$translate.instant('pci_code_sample_tooltip_copy');
    }, 2000);
  }
}
