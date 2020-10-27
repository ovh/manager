import assign from 'lodash/assign';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import pullAt from 'lodash/pullAt';

import modalTemplate from './modal/modal.html';
import modalController from './modal/modal.controller';

export default /* @ngInject */ function controller(
  $q,
  $translate,
  $uibModal,
  TucToast,
  TucToastError,
) {
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
      return self.refreshMembers().catch((err) => new TucToastError(err));
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
    const services = map(self.api.getMemberList(), 'number').concat(
      self.addMemberForm.numbers,
    );
    self.servicesToExclude.splice(0, self.servicesToExclude.length);
    forEach(services, (s) => {
      self.servicesToExclude.push(s);
    });
    return self.servicesToExclude;
  };

  self.addMembers = function addMembers(form) {
    const modal = $uibModal.open({
      animation: true,
      template: modalTemplate,
      controller: modalController,
      controllerAs: '$ctrl',
    });
    modal.result.then(() => {
      self.loaders.adding = true;
      return self.api
        .addMembers(
          map(
            filter(
              self.addMemberForm.numbers,
              (number) => number && number.length,
            ),
            (number) => assign({ number }, self.addMemberForm.options),
          ),
        )
        .then(() => {
          TucToast.success(
            $translate.instant('telephony_alias_members_add_success'),
          );
          self.resetMemberAddForm();
          form.$setPristine();
        })
        .catch((err) => new TucToastError(err))
        .finally(() => {
          self.loaders.adding = false;
        });
    });
  };

  self.removeMemberAt = function removeMemberAt(index) {
    if (index === 0 && self.addMemberForm.numbers.length === 1) {
      self.addMemberForm.numbers[0] = null;
    } else {
      pullAt(self.addMemberForm.numbers, index);
    }
  };
}
