export default class LogsEncryptionKeysAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucControllerHelper,
    CucCloudMessage,
    LogsHelperService,
    LogsConstants,
    LogsEncryptionKeysService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.LogsEncryptionKeysService = LogsEncryptionKeysService;
  }

  $onInit() {
    this.encryptionKey = {
      title: null,
      fingerprint: null,
      content: null,
    };
    this.placeholders = {
      title: this.LogsConstants.ENCRYPTION_KEY_TITLE_PLACEHOLDER,
      fingerprint: this.LogsConstants.ENCRYPTION_KEY_FINGERPRINT_PLACEHOLDER,
      content: this.LogsConstants.ENCRYPTION_KEY_CONTENT_PLACEHOLDER,
    };
  }

  /**
   * Submit encryption key creation form
   */
  submit() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    return this.createEncryptionKey();
  }

  /**
   * Create an encryption key on API side
   */
  createEncryptionKey() {
    this.CucCloudMessage.flushChildMessage();
    this.createEncryptionKeyLoading = true;
    this.LogsEncryptionKeysService.createEncryptionKey(
      this.serviceName,
      this.encryptionKey,
    )
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          this.serviceName,
          operation.data || operation,
          'logs_encryption_keys_add_success',
          { encryptionKeyName: this.encryptionKey.title },
        ),
      )
      .then(() => {
        this.createEncryptionKeyLoading = false;
        this.goToEncryptionKeysHomePage();
      })
      .catch((err) => {
        this.LogsHelperService.handleError(
          'logs_encryption_keys_add_error',
          err,
          {},
        );
        this.createEncryptionKeyLoading = false;
      });
  }
}
