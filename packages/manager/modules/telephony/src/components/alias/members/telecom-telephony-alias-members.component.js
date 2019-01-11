angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.xml`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
      .then(x => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').component('telecomTelephonyAliasMembers', {
  bindings: {
    api: '=',
  },
  templateUrl: 'components/telecom/telephony/alias/members/telecom-telephony-alias-members.html',
  controller($q, $translate, $translatePartialLoader, TucToast, TucToastError) {
    const self = this;

    self.$onInit = function () {
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

      $translatePartialLoader.addPart('../components/telecom/telephony/alias/members');
      return $translate.refresh().finally(() => {
        self.isInitialized = true;
        return self.refreshMembers().catch(err => new TucToastError(err)).finally(() => {
          self.loaders.init = false;
        });
      });
    };

    self.api.addMembersToList = function (toAdd) {
      _.each(toAdd.reverse(), (member) => {
        self.members.unshift(member);
      });
      self.api.reorderMembers(self.members).then((orderedMembers) => {
        self.members = orderedMembers;
      });
    };

    self.api.getMemberList = function () {
      return angular.copy(self.members);
    };

    self.refreshMembers = function () {
      self.members = null;
      return self.api.fetchMembers()
        .then(members => self.api.reorderMembers(members)).then((orderedMembers) => {
          self.members = orderedMembers;
        })
        .catch(err => new TucToastError(err))
        .finally(() => {
          self.loaders.init = true;
        });
    };

    self.updateMemberDescription = function (member) {
      if (member.description === undefined) {
        self.api.fetchMemberDescription(member)
          .then((result) => {
            _.set(member, 'description', result);
          })
          .catch(() => {
            _.set(member, 'description', '');
          });
      }
    };

    self.onSwapMembers = function (fromMember, toMember) {
      const from = angular.copy(fromMember);
      const to = angular.copy(toMember);

      // we do it by hand first so the ui is refreshed immediately
      const fromPos = fromMember.position;
      const toPos = toMember.position;
      _.set(fromMember, 'position', toPos);
      _.set(toMember, 'position', fromPos);
      self.members = _.sortBy(self.members, 'position');

      self.sortableMembersOpts.disabled = true;
      return self.api
        .swapMembers(from, to)
        .then(() => self.api.reorderMembers(self.members))
        .then((orderedMembers) => {
          self.members = orderedMembers;
        })
        .catch((err) => {
          // revert changes
          _.set(fromMember, 'position', fromPos);
          _.set(toMember, 'position', toPos);
          self.members = _.sortBy(self.members, 'position');
          return new TucToastError(err);
        })
        .finally(() => {
          self.sortableMembersOpts.disabled = false;
        });
    };

    self.onMoveMember = function (ev, ui) {
      const targetPosition = ui.item.attr('data-position');
      const movedMember = self.members[targetPosition];
      const swappedMember = self.membersBeforeDrag[targetPosition];

      // check if position changed ? (not dropped at the same place)
      if (movedMember.agentId === swappedMember.agentId) {
        return;
      }

      self.onSwapMembers(movedMember, swappedMember);
    };

    self.startMemberEdition = function (member) {
      self.memberInEdition = angular.copy(member);
      self.memberInEdition.timeout = member.timeout ? member.timeout : 1;
    };

    self.cancelMemberEdition = function () {
      self.memberInEdition = null;
    };

    self.submitMemberChanges = function () {
      self.loaders.editing = true;
      const attrs = ['status', 'timeout', 'wrapUpTime', 'simultaneousLines'];
      return self.api.updateMember(self.memberInEdition).then(() => {
        TucToast.success($translate.instant('telephony_alias_members_change_success'));
        const toUpdate = _.find(self.members, { agentId: self.memberInEdition.agentId });
        _.assign(toUpdate, _.pick(self.memberInEdition, attrs));
        self.cancelMemberEdition();
      }).catch(err => new TucToastError(err)).finally(() => {
        self.loaders.editing = false;
      });
    };

    self.deleteMember = function (toDelete) {
      self.loaders.deleting = true;
      self.api.deleteMember(self.memberToDelete).then(() => {
        self.memberToDelete = null;
        TucToast.success($translate.instant('telephony_alias_members_delete_success'));
        _.remove(self.members, m => m.agentId === toDelete.agentId);
        return self.api.reorderMembers(self.members);
      }).then((orderedMembers) => {
        self.members = orderedMembers;
      }).catch(err => new TucToastError(err))
        .finally(() => {
          self.loaders.deleting = false;
        });
    };
  },
});
