import ClipboardJS from 'clipboard';

export default class PasswordClipboardComponentController {
  /* @ngInject */
  constructor($element, $timeout, $translate) {
    this.$element = $element;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.SECRET_KEY_CLIPBOARD_BTN_ID = 'secretKeyClipboardCopyBtnId';
  }

  $onInit() {
    return this.$timeout().then(() => {
      this.shouldDisplayPasswordInput = !this.isDisplayableShowHidePasswordBtn;
      const tooltipText = this.getClipboardTooltipContent();
      this.model = {
        clipboard: new ClipboardJS(`#${this.SECRET_KEY_CLIPBOARD_BTN_ID}`),
        target: this.$element[0].querySelector('.oui-clipboard__control'),
        isTextCopied: false,
        tooltipText,
      };

      this.model.clipboard
        .on('success', (evt) => this.onClipboardCopySuccess(evt))
        .on('error', (evt) => this.onClipboardCopyFail(evt));
    });
  }

  $onDestroy() {
    return this.model.clipboard.destroy();
  }

  getClipboardTooltipContent() {
    return this.$translate.instant(
      this?.model?.isTextCopied
        ? 'pci_projects_project_storages_components_password_clipboard_tooltip_action_copied'
        : 'pci_projects_project_storages_components_password_clipboard_tooltip_action_copy',
    );
  }

  getPasswordLabel(isText) {
    return this.$translate.instant(
      isText
        ? 'pci_projects_project_storages_components_password_clipboard_label_hide_password'
        : 'pci_projects_project_storages_components_password_clipboard_label_show_password',
    );
  }

  resetToDefault() {
    this.model.isTextCopied = false;
    this.model.tooltipText = this.getClipboardTooltipContent();
  }

  onShowHidePasswordClick() {
    this.shouldDisplayPasswordInput = !this.shouldDisplayPasswordInput;
  }

  onClipboardClick() {
    this.onCopyClick();
    return this.resetToDefault();
  }

  onClipboardCopySuccess() {
    this.model.isTextCopied = true;
    this.model.tooltipText = this.getClipboardTooltipContent();
    this.model.target.focus();
  }

  onClipboardCopyFail() {
    this.model.tooltipText = this.$translate.instant(
      'pci_projects_project_storages_components_password_clipboard_tooltip_action_copy_not_supported',
    );
  }
}
