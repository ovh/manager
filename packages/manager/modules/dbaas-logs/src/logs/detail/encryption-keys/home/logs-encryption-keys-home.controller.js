import detailTemplate from './detail/detail.html';
import datagridToIcebergFilter from '../../logs-iceberg.utils';

export default class LogsEncryptionKeysHomeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
    LogsEncryptionKeysService,
    CucControllerHelper,
    CucCloudMessage,
    LogsHelperService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.LogsEncryptionKeysService = LogsEncryptionKeysService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsHelperService = LogsHelperService;
  }

  /**
   * Retrieve encryption keys list, according to pagination/sort/filter
   *
   * @param offset int element offset to retrieve results from
   * @param pageSize int Number of results to retrieve
   * @param sort Object Sort object from ovh-ui datagrid
   * @param criteria Object Criteria object from ovh-ui datagrid
   * @return {*|Promise<any>}
   */
  loadEncryptionKeys({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((c) => {
      const name = c.property || 'title';
      return datagridToIcebergFilter(name, c.operator, c.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsEncryptionKeysService.getPaginatedEncryptionKeys(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  /**
   * Display a modal with encryption key details
   *
   * @param encryptionKey Object Encryption key object from API
   * @return {*|Promise<any>}
   */
  showEncryptionKeyDetail(encryptionKey) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: detailTemplate,
        controller: 'LogsEncryptionKeysDetailCtrl',
        controllerAs: '$ctrl',
        resolve: {
          encryptionKey: () => encryptionKey,
        },
      },
    });
  }

  /**
   * Display a modal to confirm encryption key deletion
   *
   * @param encryptionKey Object Encryption key object from API
   * @return {*|Promise<any>}
   */
  showEncryptionKeyDeleteConfirm(encryptionKey) {
    this.CucCloudMessage.flushChildMessage();
    return this.CucControllerHelper.modal
      .showDeleteModal({
        titleText: this.$translate.instant('logs_encryption_keys_delete_title'),
        textHtml: this.$translate.instant(
          'logs_encryption_keys_delete_message',
          {
            encryptionKeyName: `<strong>${encryptionKey.title}</strong>`,
          },
        ),
      })
      .then(() => this.removeEncryptionKey(encryptionKey));
  }

  /**
   * Delete an encryption key on API
   *
   * @param encryptionKey Object Encryption key object from API
   */
  removeEncryptionKey(encryptionKey) {
    this.CucCloudMessage.flushChildMessage();
    this.deleteEncryptionKeyLoading = true;
    this.LogsEncryptionKeysService.deleteEncryptionKey(
      this.serviceName,
      encryptionKey,
    )
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          this.serviceName,
          operation.data || operation,
          'logs_encryption_keys_delete_success',
          { encryptionKeyName: encryptionKey.title },
        ),
      )
      .catch((err) => {
        this.LogsHelperService.handleError(
          'logs_encryption_keys_delete_error',
          err,
          { encryptionKeyName: encryptionKey.title },
        );
        this.deleteEncryptionKeyLoading = false;
      })
      .finally(() => {
        this.deleteEncryptionKeyLoading = false;
        this.ouiDatagridService.refresh('encryption-keys-datagrid', true);
        this.CucControllerHelper.scrollPageToTop();
      });
  }
}
