import _ from 'lodash';

import template from './telecom-telephony-alias-members-add.html';
import addModalCtrl from './telecom-telephony-alias-members-add-modal.controller';
import addModalTpl from './telecom-telephony-alias-members-add-modal.html';

export default {
  bindings: {
    api: '=',
  },
  template,
  controller($q, $translate, $uibModal, TucToast, TucToastError) {
    const self = this;

    self.$onInit = function $onInit() {
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

      return $translate.refresh().finally(() => {
        self.isInitialized = true;
        return self.refreshMembers().catch(err => new TucToastError(err));
      });
    };

    self.onChooseServicePopover = function onChooseServicePopover(service, pos) {
      self.addMemberForm.numbers[pos] = service.serviceName;
    };

    self.resetMemberAddForm = function resetMemberAddForm() {
      self.addMemberForm.numbers = [null];
      self.addMemberForm.options = {
        timeout: 20,
        wrapUpTime: 1,
        simultaneousLines: 1,
        status: 'available',
      };
    };

    self.getServicesToExclude = function getServicesToExclude() {
      const services = _.pluck(self.api.getMemberList(), 'number').concat(self.addMemberForm.numbers);
      self.servicesToExclude.splice(0, self.servicesToExclude.length);
      _.each(services, (s) => {
        self.servicesToExclude.push(s);
      });
      return self.servicesToExclude;
    };

    self.addMembers = function addMembers(form) {
      const modal = $uibModal.open({
        animation: true,
        templateUrl: addModalTpl,
        controller: addModalCtrl,
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

    self.removeMemberAt = function removeMemberAt(index) {
      if (index === 0 && self.addMemberForm.numbers.length === 1) {
        self.addMemberForm.numbers[0] = null;
      } else {
        _.pullAt(self.addMemberForm.numbers, index);
      }
    };
  },
};
