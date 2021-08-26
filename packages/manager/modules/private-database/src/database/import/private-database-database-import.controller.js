import angular from 'angular';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import last from 'lodash/last';
import set from 'lodash/set';

export default class PrivateDatabaseImportCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    PrivateDatabase,
    WucUser,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.userService = WucUser;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.file = null;
    this.importScriptTag = {
      key: 'WEB_HOSTING_DATABASE_IMPORT_SCRIPT',
      value: 'true',
    };

    this.loading = {
      documents: false,
    };

    this.model = {
      database: angular.copy(this.$scope.currentActionData),
      document: {
        id: null,
      },
      flushDatabase: false,
      sendEmail: true,
      newFileUploaded: false,
      actions: {
        IMPORT_FROM_NEW: 'IMPORT_FROM_NEW',
        IMPORT_FROM_EXISTING: 'IMPORT_FROM_EXISTING',
      },
    };

    this.selected = {
      action: null,
    };

    this.$scope.importDatabase = () => this.importDatabase();
    this.$scope.getDocuments = () => this.getDocuments();
    this.$scope.resetDocumentSelection = () => this.resetDocumentSelection();
  }

  submit() {
    const file = head(this.file);
    const filename = this.model.uploadFileName;
    this.isSendingFile = true;

    this.userService
      .uploadFile(filename, file, [this.importScriptTag])
      .then((id) => {
        set(this.model, 'document.id', id);
        this.atLeastOneFileHasBeenSend = true;
      })
      .finally(() => {
        this.isSendingFile = false;
      });
  }

  getDocuments() {
    if (this.selected.action === this.model.actions.IMPORT_FROM_EXISTING) {
      this.loading.documents = true;
      this.userService
        .getDocuments()
        .then((data) => {
          const onlyImportScripts = [];

          forEach(data, (document) => {
            if (
              find(document.tags, {
                key: this.importScriptTag.key,
                value: this.importScriptTag.value,
              })
            ) {
              onlyImportScripts.push(document);
            }
          });
          this.model.documents = onlyImportScripts;
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'private_database_database_table_popover_import_step1_load_documents_error',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.documents = false;
        });
    }
  }

  importDatabase() {
    this.$scope.resetAction();

    this.privateDatabaseService
      .importDatabase(
        this.productId,
        this.model.database,
        this.model.document.id,
        this.model.flushDatabase,
        this.model.sendEmail,
      )
      .then(() => {
        this.alerter.success(
          this.$translate.instant(
            'private_database_database_table_popover_import_step3_succes',
          ),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant(
            'private_database_database_table_popover_import_step3_fail',
          ),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }

  isActionSelected() {
    return get(this.selected, 'action', false);
  }

  isDocumentsValid() {
    return get(this.model, 'document.id') != null;
  }

  resetDocumentSelection() {
    const elt = angular.element("input[type='file'][name='file']")[0];
    angular.element(elt).val(null);
    this.formFileUpload.$setPristine();

    set(this.model, 'document', null);
    set(this.model, 'uploadFileName', null);
    this.file = null;
    this.atLeastOneFileHasBeenSend = false;
  }

  onFileChange(input) {
    const filename = get(head(this.file), 'name', '');
    const ext = last(filename.split('.'));
    const validFormat = filename === ext || /gz|sql|txt/i.test(ext);

    this.model.uploadFileName = filename;
    input.$setValidity('format', validFormat);
  }
}
