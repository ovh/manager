import angular from 'angular';
import _ from 'lodash';

export default class PrivateDatabaseImportCtrl {
  /* @ngInject */

  constructor(
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    PrivateDatabase,
    User,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.userService = User;
  }

  $onInit() {
    this.productId = this.$stateParams.serviceName;

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
    const file = _.head(this.file);
    const filename = this.model.uploadFileName;
    this.isSendingFile = true;

    this.userService
      .uploadFile(filename, file, [this.importScriptTag])
      .then((id) => {
        _.set(this.model, 'document.id', id);
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

          _.forEach(data, (document) => {
            if (
              _.find(document.tags, {
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
            this.$translate.instant('hosting_tab_DATABASES_table_popover_import_step1_load_documents_error'),
            _.get(err, 'data', err),
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
          this.$translate.instant('hosting_tab_DATABASES_table_popover_import_step3_succes'),
          this.$scope.alerts.main,
        );
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('hosting_tab_DATABASES_table_popover_import_step3_fail'),
          _.get(err, 'data', err),
          this.$scope.alerts.main,
        );
      });
  }

  isActionSelected() {
    return _.get(this.selected, 'action', false);
  }

  isDocumentsValid() {
    return _.get(this.model, 'document.id') != null;
  }

  resetDocumentSelection() {
    const elt = angular.element("input[type='file'][name='file']")[0];
    angular.element(elt).val(null);
    this.formFileUpload.$setPristine();

    _.set(this.model, 'document', null);
    _.set(this.model, 'uploadFileName', null);
    this.file = null;
    this.atLeastOneFileHasBeenSend = false;
  }

  onFileChange(input) {
    const filename = _.get(_.head(this.file), 'name', '');
    const ext = _.last(filename.split('.'));
    const validFormat = filename === ext || /gz|sql|txt/i.test(ext);

    this.model.uploadFileName = filename;
    input.$setValidity('format', validFormat);
  }
}
