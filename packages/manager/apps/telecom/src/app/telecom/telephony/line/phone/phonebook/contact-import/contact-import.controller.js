import endsWith from 'lodash/endsWith';
import get from 'lodash/get';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyLinePhonePhonebookContactImportCtrl(
  $q,
  $stateParams,
  $timeout,
  $translate,
  $uibModalInstance,
  bookKey,
  OvhApiTelephony,
  OvhApiMe,
  TucToastError,
) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.checkValidTextExtention = function checkValidTextExtention(file) {
    const validExtensions = ['csv', 'xls', 'xlsx'];
    const fileName = file ? file.name : '';
    const found = some(validExtensions, (ext) =>
      endsWith(fileName.toLowerCase(), ext),
    );
    if (!found) {
      TucToastError(
        $translate.instant(
          'telephony_phonebook_contact_action_import_file_invalid',
        ),
      );
    }
    return found;
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.importContact = function importContact() {
    self.phonecontactForm.isImporting = true;
    return $q
      .all({
        noop: $timeout(angular.noop, 1000),
        import: OvhApiMe.Document()
          .v6()
          .upload(
            self.phonecontactForm.uploadedFile.name,
            self.phonecontactForm.uploadedFile,
          )
          .then(
            (doc) =>
              OvhApiTelephony.Line()
                .Phone()
                .Phonebook()
                .v6()
                .import(
                  {
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    bookKey,
                  },
                  {
                    documentId: doc.id,
                  },
                ).$promise,
          ),
      })
      .then((result) => {
        self.phonecontactForm.isImporting = false;
        self.phonecontactForm.hasBeenImported = true;
        return $timeout(
          self.close({
            taskId: get(result.import, 'taskId'),
          }),
          1000,
        );
      })
      .catch((err) =>
        self.cancel({
          type: 'API',
          msg: err,
        }),
      );
  };

  self.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function close(task) {
    return $uibModalInstance.close(task || true);
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.phonecontactForm = {
      uploadedFile: null,
      isImporting: false,
      hasBeenImported: false,
    };
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
