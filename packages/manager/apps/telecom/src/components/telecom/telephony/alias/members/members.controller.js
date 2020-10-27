import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import pick from 'lodash/pick';
import remove from 'lodash/remove';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ function controller(
  $q,
  $translate,
  TucToast,
  TucToastError,
) {
  const self = this;

  self.$onInit = function $onInit() {
    self.loaders = {
      init: false,
      deleting: false,
    };
    self.sortableMembersOpts = {
      handle: '.ovh-font-grip',
      start() {
        self.membersBeforeDrag = angular.copy(self.members);
      },
      stop: self.onMoveMember,
      disabled: false,
    };
    self.members = null;
    self.membersBeforeDrag = null;
    self.memberInEdition = null;
    self.memberToDelete = null;

    self.api.addMembersToList = function addMembersToList(toAdd) {
      forEach(toAdd.reverse(), (member) => {
        self.members.unshift(member);
      });
      self.api.reorderMembers(self.members).then((orderedMembers) => {
        self.members = orderedMembers;
      });
    };

    self.api.getMemberList = function getMemberList() {
      return angular.copy(self.members);
    };

    return $translate.refresh().finally(() => {
      self.isInitialized = true;
      return self.refreshMembers().finally(() => {
        self.loaders.init = false;
      });
    });
  };

  self.refreshMembers = function refreshMembers() {
    self.members = null;
    return self.api
      .fetchMembers()
      .then((members) => self.api.reorderMembers(members))
      .then((orderedMembers) => {
        self.members = orderedMembers;
      })
      .catch((err) => {
        // eslint-disable-next-line no-new
        new TucToastError(err);
        return $q.reject(err);
      })
      .finally(() => {
        self.loaders.init = true;
      });
  };

  self.updateMemberDescription = function updateMemberDescription(member) {
    if (member.description === undefined) {
      self.api
        .fetchMemberDescription(member)
        .then((result) => {
          set(member, 'description', result);
        })
        .catch(() => {
          set(member, 'description', '');
        });
    }
  };

  self.onSwapMembers = function onSwapMembers(fromMember, toMember) {
    const from = angular.copy(fromMember);
    const to = angular.copy(toMember);

    // we do it by hand first so the ui is refreshed immediately
    const fromPos = fromMember.position;
    const toPos = toMember.position;
    set(fromMember, 'position', toPos);
    set(toMember, 'position', fromPos);
    self.members = sortBy(self.members, 'position');

    self.sortableMembersOpts.disabled = true;
    return self.api
      .swapMembers(from, to)
      .then(() => self.api.reorderMembers(self.members))
      .then((orderedMembers) => {
        self.members = orderedMembers;
      })
      .catch((err) => {
        // revert changes
        set(fromMember, 'position', fromPos);
        set(toMember, 'position', toPos);
        self.members = sortBy(self.members, 'position');
        return new TucToastError(err);
      })
      .finally(() => {
        self.sortableMembersOpts.disabled = false;
      });
  };

  self.onMoveMember = function onMoveMember(ev, ui) {
    const targetPosition = ui.item.attr('data-position');
    const movedMember = self.members[targetPosition];
    const swappedMember = self.membersBeforeDrag[targetPosition];

    // check if position changed ? (not dropped at the same place)
    if (movedMember.agentId === swappedMember.agentId) {
      return;
    }

    self.onSwapMembers(movedMember, swappedMember);
  };

  self.startMemberEdition = function startMemberEdition(member) {
    self.memberInEdition = angular.copy(member);
    self.memberInEdition.timeout = member.timeout ? member.timeout : 1;
  };

  self.cancelMemberEdition = function cancelMemberEdition() {
    self.memberInEdition = null;
  };

  self.submitMemberChanges = function submitMemberChanges() {
    self.loaders.editing = true;
    const attrs = ['status', 'timeout', 'wrapUpTime', 'simultaneousLines'];
    return self.api
      .updateMember(self.memberInEdition)
      .then(() => {
        TucToast.success(
          $translate.instant('telephony_alias_members_change_success'),
        );
        const toUpdate = find(self.members, {
          agentId: self.memberInEdition.agentId,
        });
        assign(toUpdate, pick(self.memberInEdition, attrs));
        self.cancelMemberEdition();
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loaders.editing = false;
      });
  };

  self.deleteMember = function deleteMember(toDelete) {
    self.loaders.deleting = true;
    self.api
      .deleteMember(self.memberToDelete)
      .then(() => {
        self.memberToDelete = null;
        TucToast.success(
          $translate.instant('telephony_alias_members_delete_success'),
        );
        remove(self.members, (m) => m.agentId === toDelete.agentId);
        return self.api.reorderMembers(self.members);
      })
      .then((orderedMembers) => {
        self.members = orderedMembers;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loaders.deleting = false;
      });
  };
}
