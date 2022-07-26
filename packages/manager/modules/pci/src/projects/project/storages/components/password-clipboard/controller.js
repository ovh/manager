import ClipboardJS from 'clipboard';

export default class PasswordClipboardComponentController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;

    this.SECRET_KEY_CLIPBOARD_BTN_ID = 'secretKeyClipboardCopyBtnId';
    this.SECRET_KEY_INPUT_ID = 'secretKeyInputId';
  }

  $onInit() {
    this.secretKeyClipboard = new ClipboardJS(
      `#${this.SECRET_KEY_CLIPBOARD_BTN_ID}`,
    );
  }

  getPasswordLabel(isText) {
    return this.$translate.instant(
      isText
        ? 'pci_projects_project_storages_components_password_clipboard_label_hide_password'
        : 'pci_projects_project_storages_components_password_clipboard_label_show_password',
    );
  }
}
