import indexOf from 'lodash/indexOf';

angular
  .module('managerApp')
  .controller(
    'CloudProjectBillingRightsCtrl',
    function CloudProjectBillingRightsCtrl(
      OvhApiCloud,
      OvhApiCloudProjectServiceInfos,
      OvhApiMe,
      $stateParams,
      CucCloudMessage,
      CucControllerHelper,
      $translate,
      REDIRECT_URLS,
      $window,
    ) {
      const self = this;
      const serviceName = $stateParams.projectId;

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
            return OvhApiMe.v6()
              .get()
              .$promise.then((me) => {
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
        return REDIRECT_URLS.contacts;
      };

      self.openContacts = function openContacts() {
        if (self.canChangeContacts()) {
          let redirectUrl = REDIRECT_URLS.contacts;
          redirectUrl = redirectUrl.replace('{serviceName}', serviceName);
          $window.open(redirectUrl, '_blank');
        }
      };

      // show or hide (toggle) the owner contact field
      self.toggleEditOwner = function toggleEditOwner() {
        self.toggle.owner = !self.toggle.owner;
        if (self.toggle.owner) {
          $('#ownerContactInput').focus();
        }
      };

      // watch for escape/enter keys when editing owner contact field
      self.watchOwnerInput = function watchOwnerInput(ev) {
        if (ev && ev.keyCode === 27) {
          // escape key
          ev.stopPropagation();
          ev.preventDefault();
          self.toggle.owner = false;
          self.contactFormData.owner = self.model.owner;
        }
      };

      /* ==================================================
       * Billing contact form
       */

      // show or hide (toggle) the billing contact field
      self.toggleEditBilling = function toggleEditBilling() {
        self.toggle.billing = !self.toggle.billing;
        if (self.toggle.billing) {
          $('#billingContactInput').focus();
        }
      };

      // watch for escape/enter keys when editing billing contact field
      self.watchBillingInput = function watchBillingInput(ev) {
        if (ev && ev.keyCode === 27) {
          // escape key
          ev.stopPropagation();
          ev.preventDefault();
          self.toggle.billing = false;
          self.contactFormData.billing = self.model.billing;
        }
      };

      /* ==================================================
       * Rights table
       */

      self.showAddRight = function showAddRight() {
        CucControllerHelper.modal
          .showModal({
            modalConfig: {
              templateUrl:
                'app/cloud/project/billing/rights/addRights/cloud-project-billing-rights-add.html',
              controller: 'CloudProjectBillingRightsAddCtrl',
              controllerAs: '$ctrl',
              resolve: {
                model: () => self.model,
              },
            },
          })
          .then(() => {
            self.getRights(true);
            CucCloudMessage.success(
              $translate.instant('cpb_rights_table_rights_add_success'),
            );
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpb_rights_add_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          })
          .finally(() => {
            self.loader = false;
          });
      };

      self.getRights = function getRights(clearCache) {
        self.loader = true;
        if (clearCache) {
          OvhApiCloud.Project().Acl().v6().resetQueryCache();
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
              OvhApiCloud.Project().Acl().v6().remove({
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
        return OvhApiCloud.Project().Acl().v6().get({
          serviceName,
          accountId: account.accountId,
        }).$promise;
      };

      // Controller initialization
      self.init();
    },
  );
