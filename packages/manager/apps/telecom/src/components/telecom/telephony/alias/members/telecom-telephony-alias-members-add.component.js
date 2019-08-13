angular.module('managerApp').component('telecomTelephonyAliasMembersAdd', {
  bindings: {
    api: '=',
  },
  templateUrl: 'components/telecom/telephony/alias/members/telecom-telephony-alias-members-add.html',
  controller($q, $translate, $translatePartialLoader, $uibModal, TucToast, TucToastError) {
    const self = this;

    self.$onInit = function () {
      self.addMemberForm = {
        numbers: [null],
        options: {},
      };

      self.loaders = {
        adding: false,
      };

      // list of already added services
      self.servicesToExclude = [];

      // forms
      self.resetMemberAddForm();

      $translatePartialLoader.addPart('../components/telecom/telephony/alias/members');
      return $translate.refresh().finally(() => {
        self.isInitialized = true;
        return self.refreshMembers().catch(err => new TucToastError(err));
      });
    };

    self.onChooseServicePopover = function (service, pos) {
      self.addMemberForm.numbers[pos] = service.serviceName;
    };

    self.resetMemberAddForm = function () {
      self.addMemberForm.numbers = [null];
      self.addMemberForm.options = {
        timeout: 20,
        wrapUpTime: 1,
        simultaneousLines: 1,
        status: 'available',
      };
    };

    self.getServicesToExclude = function () {
      const services = _.pluck(self.api.getMemberList(), 'number').concat(self.addMemberForm.numbers);
      self.servicesToExclude.splice(0, self.servicesToExclude.length);
      _.each(services, (s) => {
        self.servicesToExclude.push(s);
      });
      return self.servicesToExclude;
    };

    self.addMembers = function (form) {
      const modal = $uibModal.open({
        animation: true,
        templateUrl: 'components/telecom/telephony/alias/members/telecom-telephony-alias-members-add-modal.html',
        controller: 'telecomTelephonyAliasMembersAddModal',
        controllerAs: '$ctrl',
      });
      modal.result.then(() => {
        self.loaders.adding = true;
        return self.api
          .addMembers(_(self.addMemberForm.numbers)
            .filter(number => number && number.length)
            .map(number => _.assign({ number }, self.addMemberForm.options))
            .value())
          .then(() => {
            TucToast.success($translate.instant('telephony_alias_members_add_success'));
            self.resetMemberAddForm();
            form.$setPristine();
          })
          .catch(err => new TucToastError(err))
          .finally(() => {
            self.loaders.adding = false;
          });
      });
    };

    self.removeMemberAt = function (index) {
      if (index === 0 && self.addMemberForm.numbers.length === 1) {
        self.addMemberForm.numbers[0] = null;
      } else {
        _.pullAt(self.addMemberForm.numbers, index);
      }
    };
  },
});
