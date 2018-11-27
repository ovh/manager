angular
  .module('managerApp')
  .controller('TelecomSmsPhonebooksPhonebookContactImportCtrl', class TelecomSmsPhonebooksPhonebookContactImportCtrl {
    constructor(
      $q, $stateParams, $timeout, $translate, $uibModalInstance,
      phonebook, OvhApiSms, OvhApiMe, TucToastError,
    ) {
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.$uibModalInstance = $uibModalInstance;
      this.phonebook = phonebook;
      this.api = {
        sms: {
          phonebooks: OvhApiSms.Phonebooks().v6(),
        },
        user: {
          document: OvhApiMe.Document().v6(),
        },
      };
      this.TucToastError = TucToastError;
    }

    $onInit() {
      this.model = {
        phonebook: angular.copy(this.phonebook),
      };
      this.phonecontactForm = {
        uploadedFile: null,
        isImporting: false,
        hasBeenImported: false,
      };
    }

    /**
     * Import phonebook contact.
     * @return {Promise}
     */
    importContact() {
      this.phonecontactForm.isImporting = true;
      return this.$q.all({
        noop: this.$timeout(angular.noop, 1000),
        import: this.api.user.document.upload(
          this.phonecontactForm.uploadedFile.name,
          this.phonecontactForm.uploadedFile,
        ).then(doc => this.api.sms.phonebooks.import({
          serviceName: this.$stateParams.serviceName,
          bookKey: _.get(this.phonebook, 'bookKey'),
        }, {
          documentId: doc.id,
        }).$promise),
      }).then((result) => {
        this.phonecontactForm.isImporting = false;
        this.phonecontactForm.hasBeenImported = true;
        return this.$timeout(() => this.close({
          taskId: _.get(result.import, 'taskId'),
        }), 1000);
      }).catch(err => this.cancel({
        type: 'API',
        msg: err,
      }));
    }

    /**
     * Check valid text extention.
     * @param  {Object} file
     * @return {Boolean}
     */
    checkValidTextExtention(file) {
      const validExtensions = ['csv', 'xls', 'xlsx'];
      const fileName = file ? file.name : '';
      const found = _.some(validExtensions, ext => _.endsWith(fileName.toLowerCase(), ext));
      if (!found) {
        this.TucToastError(this.$translate.instant('sms_phonebooks_phonebook_contact_import_file_invalid'));
      }
      return found;
    }

    cancel(message) {
      return this.$uibModalInstance.dismiss(message);
    }

    close(task) {
      return this.$uibModalInstance.close(task || true);
    }
  });
