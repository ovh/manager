angular.module('managerApp').controller('TelecomTelephonyServiceFaxCampaignsAddCtrl', function ($q, $stateParams, $translate, $timeout, $uibModalInstance, OvhApiTelephony, OvhApiMe, TucToastError) {
  const self = this;

  /* ===============================
    =            HELPERS            =
    =============================== */

  function fetchEnums() {
    return OvhApiTelephony.v6().schema({
      billingAccount: $stateParams.billingAccount,
    }).$promise.then(schema => ({
      faxQuality: schema.models['telephony.FaxQualityEnum'].enum,
      sendType: schema.models['telephony.FaxCampaignSendTypeEnum'].enum,
      recipientsType: schema.models['telephony.FaxCampaignRecipientsTypeEnum'].enum,
    }));
  }

  function setCampainDateTime() {
    if (self.campaign.sendDate) {
      self.campaign.sendDate.setHours(self.picker.time.getHours());
      self.campaign.sendDate.setMinutes(self.picker.time.getMinutes());
    }
    return self.campaign.sendDate;
  }

  self.checkValidPdfExtention = function (file) {
    const fileName = file ? file.name : '';
    const found = _.endsWith(fileName.toLowerCase(), 'pdf');
    if (!found) {
      TucToastError($translate.instant('telephony_service_fax_campaigns_add_campaign_file_invalid'));
    }
    return found;
  };

  self.checkValidTextExtention = function (file) {
    const fileName = file ? file.name : '';
    const found = _.endsWith(fileName.toLowerCase(), 'txt');
    if (!found) {
      TucToastError($translate.instant('telephony_service_fax_campaigns_add_campaign_file_invalid'));
    }
    return found;
  };

  function uploadDocuments() {
    const promise = {};
    promise.pdf = OvhApiMe.Document().v6().upload(
      self.campaign.uploadedFile.name,
      self.campaign.uploadedFile,
    );
    if (self.campaign.recipientsType === 'document' && self.campaign.recipientsDocFile) {
      promise.recipientsDoc = OvhApiMe.Document().v6().upload(
        self.campaign.recipientsDocFile.name,
        self.campaign.recipientsDocFile,
      );
    }
    return $q.all(promise);
  }

  function createCampaign(docs) {
    const campaign = {
      recipientsType: self.campaign.recipientsType,
      documentId: _.get(docs, 'pdf.id'),
      name: self.campaign.name,
      faxQuality: self.campaign.faxQuality,
      sendType: self.campaign.sendType,
      sendDate: setCampainDateTime(),
      recipientsList: _.words(self.campaign.recipientsList),
    };
    if (self.campaign.recipientsType === 'document' && _.has(docs, 'recipientsDoc.id')) {
      campaign.recipientsDocId = _.get(docs, 'recipientsDoc.id');
    }
    return OvhApiTelephony.Fax().Campaigns().v6().create({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, campaign).$promise.catch(error => self.cancel({
      type: 'API',
      message: _.get(error, 'data.message'),
    }));
  }

  /* -----  End of HELPERS  ------ */

  /* ===============================
    =            EVENTS            =
    =============================== */

  self.openDatePicker = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    self.picker.dateOpened = true;
  };

  /* -----  End of EVENTS  ------ */

  /* ===============================
    =            ACTIONS            =
    =============================== */

  self.add = function () {
    self.loading.add = true;
    return uploadDocuments().then(docs => $q.all([
      createCampaign(docs),
      $timeout(angular.noop, 1000),
    ]).then(() => {
      self.loading.add = false;
      self.added = true;
      return $timeout(self.close, 1500);
    })).catch(error => self.cancel({
      type: 'API',
      message: _.get(error, 'data.message'),
    }));
  };

  self.cancel = function (message) {
    return $uibModalInstance.dismiss(message);
  };

  self.close = function () {
    return $uibModalInstance.close(true);
  };

  /* -----  End of ACTIONS  ------ */

  /* ======================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading = {
      init: false,
      add: false,
    };

    self.enums = {};

    self.campaign = {};

    self.picker = {
      dateOpened: false,
      time: new Date(),
      options: {
        minDate: new Date(),
      },
    };

    self.pattern = {
      recipientsList: /^\+?\d{6,17}([,;\s]\+?\d{6,17})*$/,
    };

    self.loading.init = true;
    return fetchEnums().then((enums) => {
      self.enums = enums;

      self.campaign.faxQuality = 'normal';
      self.campaign.sendType = _.last(_.pull(self.enums.sendType, 'automatic')); // scheduled
      self.campaign.recipientsType = 'list';

      // set a multiline placeholder attribut
      self.recipientsListPlaceholder = [
        $translate.instant('telephony_service_fax_campaigns_add_campaign_palceholder_recipients_list_first'),
        $translate.instant('telephony_service_fax_campaigns_add_campaign_palceholder_recipients_list_second'),
      ].join('\n');
    }).catch((err) => {
      self.campaign = {};
      return new TucToastError(err);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */

  init();
});
