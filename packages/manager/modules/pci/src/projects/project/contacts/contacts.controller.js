import indexOf from 'lodash/indexOf';

export default /* @ngInject */ function(
  $stateParams,
  $translate,
  $window,
  coreConfig,
  coreURLBuilder,
  CucCloudMessage,
  CucControllerHelper,
  guideUrl,
  OvhApiCloud,
  OvhApiCloudProjectServiceInfos,
) {
  const self = this;
  const serviceName = $stateParams.projectId;

  self.guideUrl = guideUrl;

  self.model = {
    owner: '',
    billing: '',
    isAdmin: false, // do we have admin rights?
    isUSorCA: false, // true if user country is USA or Canada
  };

  // admin & billing contact form
  self.contactFormData = {
    owner: '',
    billing: '',
  };

  // add user right form
  self.addRightFormData = {
    contact: '', // either Nic or Email depending on user country
    type: 'readOnly',
  };

  // reference to the right the user want to delete
  self.removeRight = {
    accountId: null,
  };

  // toggle display of form inputs
  self.toggle = {
    owner: false,
    billing: false,
    addUser: false,
  };

  // table data
  self.data = {
    rights: [],
  };

  // spinners ...
  self.loader = false;

  /* ==================================================
   * Initialization
   */

  function initContact() {
    return OvhApiCloudProjectServiceInfos.v6()
      .get({
        serviceName,
      })
      .$promise.then((infos) => {
        self.model.owner = infos.contactAdmin;
        self.contactFormData.owner = infos.contactAdmin;
        self.model.billing = infos.contactBilling;
        self.contactFormData.billing = infos.contactBilling;

        const me = coreConfig.getUser();
        if (me.nichandle === infos.contactAdmin) {
          self.model.isAdmin = true;
        }
        if (me.country) {
          // check if the user country is USA or Canada, in this case we display
          // email instead of NIC handle
          self.model.isUSorCA =
            indexOf(['US', 'CA'], me.country.toUpperCase()) >= 0;
        }
      });
  }

  self.init = function init() {
    self.getRights();
    initContact();
  };

  /* ==================================================
   * Owner contact form
   */

  self.canChangeContacts = function canChangeContacts() {
    return coreConfig.isRegion('EU');
  };

  self.openContacts = function openContacts() {
    if (self.canChangeContacts()) {
      const redirectURL = coreURLBuilder.buildURL(
        'dedicated',
        '#/contacts/services',
        {
          tab: 'SERVICES',
          serviceName,
        },
      );
      $window.open(redirectURL, '_blank');
    }
  };

  self.getRights = function getRights(clearCache) {
    self.loader = true;
    if (clearCache) {
      OvhApiCloud.Project()
        .Acl()
        .v6()
        .resetQueryCache();
    }
    return OvhApiCloud.Project()
      .Acl()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((rightIds) => {
        self.data.rights = rightIds.map((id) => ({ accountId: id }));
      })
      .catch((err) => {
        self.data.rights = [];
        CucCloudMessage.error(
          [
            $translate.instant('cpb_rights_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
      })
      .finally(() => {
        self.loader = false;
      });
  };

  self.removeRight = function removeRight(account) {
    self.loader = true;
    self.removeRight.accountId = account.accountId;

    return CucControllerHelper.modal
      .showConfirmationModal({
        titleText: $translate.instant('cpb_rights_delete_title'),
        text: $translate.instant('cpb_rights_delete_question', {
          nickname: account.accountId,
        }),
      })
      .then(
        () =>
          OvhApiCloud.Project()
            .Acl()
            .v6()
            .remove({
              serviceName,
              accountId: account.accountId,
            }).$promise,
      )
      .then(() => {
        self.getRights(true);
        CucCloudMessage.success(
          $translate.instant('cpb_rights_table_rights_remove_success'),
        );
      })
      .catch((err) => {
        CucCloudMessage.error(
          [
            $translate.instant('cpb_rights_remove_error'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
      })
      .finally(() => {
        self.loader = false;
        self.removeRight.accountId = null;
      });
  };

  this.transformItem = function transformItem(account) {
    return OvhApiCloud.Project()
      .Acl()
      .v6()
      .get({
        serviceName,
        accountId: account.accountId,
      }).$promise;
  };

  // Controller initialization
  self.init();
}
