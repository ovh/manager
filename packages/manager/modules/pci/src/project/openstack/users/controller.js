import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import some from 'lodash/some';

import addController from './add/controller';
import addTemplate from './add/template.html';

import openrcController from './openrc/controller';
import openrcTemplate from './openrc/template.html';

import deleteController from './delete/controller';
import deleteTemplate from './delete/template.html';

import rcloneController from './rclone/controller';
import rcloneTemplate from './rclone/template.html';

import tokenController from './token/controller';
import tokenTemplate from './token/template.html';

export default /* @ngInject */ function CloudProjectOpenstackUsersCtrl(
  OvhApiCloud,
  $translate,
  CucCloudMessage,
  $stateParams,
  Poller,
  $scope,
  OpenstackUsersPassword,
  OpenstackUsersToken,
  $filter,
  $q,
  CucControllerHelper,
  $window,
  PCI_REDIRECT_URLS,
  TARGET,
) {
  const self = this;
  const orderByFilter = $filter('orderBy');
  const pollingInterval = 5000;

  self.projectId = $stateParams.projectId;

  self.table = {
    users: {},
    selectableUsers: [],
    selectableUsersCurrentPage: [],
    selected: {},
    autoSelected: {},
  };

  self.toggle = {
    userGenerateTokenId: null,
  };

  self.order = {
    by: 'username',
    reverse: false,
  };

  self.loaders = {
    table: {
      user: false,
    },
    add: {
      token: false,
    },
    remove: {
      user: false,
      userMulti: false,
    },
    regeneratePassword: false,
    generateToken: false,
  };

  self.generateToken = {
    pass: null,
  };

  function init() {
    self.getUsers();
  }

  // ---------TOOLS---------

  self.getSelectedCount = function getSelectedCount() {
    return Object.keys(self.table.selected).length;
  };

  $scope.$watch('CloudProjectOpenstackUsersCtrl.table.selected', () => {
    // if some line were not removed => recheck or if polling happened.
    if (!isEmpty(self.table.autoSelected)) {
      // Selected (and autoselected) are represented as object: Not array of objects
      // or array of arrays.
      // Therefore, we have to loop through the keys (which represent a UserId)
      // and then compare it to the
      // userId in the user object. User.id is a number and userId a string
      // (it is an object key) so the .ToString is mandatory in order to use === instead of ==.
      forEach(keys(self.table.autoSelected), (userId) => {
        const isInUserTable = some(self.table.users, user => user.id.toString() === userId);
        if (isInUserTable) {
          self.table.selected[userId] = true;
        }
      });
      self.table.autoSelected = [];
    }
  }, true);

  function getSelectableUserList(userList) {
    return filter(userList, user => user.status !== 'disabled');
  }

  $scope.$watch('CloudProjectComputeSnapshotCtrl.table.usersCurrentPage', (users) => {
    self.table.selectableUsersCurrentPage = getSelectableUserList(users);
  });

  // ---------ORDER---------

  self.orderBy = function orderBy(by) {
    if (by) {
      if (self.order.by === by) {
        self.order.reverse = !self.order.reverse;
      } else {
        self.order.by = by;
      }
    }
    self.table.users = orderByFilter(self.table.users, self.order.by, self.order.reverse);
    self.table.selectableUsers = orderByFilter(
      self.table.selectableUsers,
      self.order.by, self.order.reverse,
    );
  };

  self.selectUser = function selectUser(id, active) {
    if (active) {
      setTimeout(() => {
        const areaheight = $(`#user_${id}`).prop('scrollHeight');
        $(`#user_${id}`).height(areaheight).select();
      }, 0);
    }
  };

  function updateUserList(userList) {
    // We set autoSelected so the selected entries remain selected after polling.
    self.table.autoSelected = self.table.selected;

    self.table.users = userList;
    self.table.selectableUsers = getSelectableUserList(userList);
    self.orderBy();
    self.loaders.table.user = false;
  }

  self.getUsers = function getUsers() {
    if (!self.loaders.table.user) {
      self.table.users = [];
      self.loaders.table.user = true;

      return Poller.poll(
        `/cloud/project/${self.projectId}/user`,
        null,
        {
          namespace: 'cloud.users.query',
          scope: $scope.$id,
          interval: pollingInterval,
        },
      ).then((userList) => {
        updateUserList(userList);
      }, (err) => {
        if (err && err.status) {
          self.table.user = null;
          CucCloudMessage.error([$translate.instant('openstackusers_users_userlist_error'), (err.data && err.data.message) || ''].join(' '));
        }
      }, (userList) => {
        updateUserList(userList);
      }).finally(() => {
        self.loaders.table.user = false;
      });
    }
    return null;
  };

  $scope.$on('$destroy', () => {
    Poller.kill({ namespace: 'cloud.users.query' });
  });

  self.regeneratePassword = function regeneratePassword(currentUser) {
    if (!self.loaders.regeneratePassword) {
      self.loaders.regeneratePassword = currentUser.id;
      return OvhApiCloud.Project().User().v6().password({
        serviceName: self.projectId,
        userId: currentUser.id,
      }, {}).$promise.then((newUser) => {
        const currentUserFound = find(
          self.table.users,
          user => user.username === currentUser.username,
        );
        OpenstackUsersPassword.put(self.projectId, currentUserFound.id, newUser.password);
        CucCloudMessage.success($translate.instant('openstackusers_users_regeneratepassword_success', currentUser));
      }, (err) => {
        CucCloudMessage.error([$translate.instant('openstackusers_users_regeneratepassword_error'), (err.data && err.data.message) || ''].join(' '));
      }).finally(() => {
        self.loaders.regeneratePassword = false;
      });
    }
    return null;
  };

  self.downloadOpenrcFile = function downloadOpenrcFile(currentUser) {
    CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: openrcTemplate,
        controller: openrcController,
        controllerAs: 'OpenstackUsersOpenrcCtrl',
        resolve: {
          openstackUser: () => currentUser,
        },
      },
    });
  };

  self.downloadRcloneFile = function downloadRcloneFile(currentUser) {
    CucControllerHelper.modal.showModal({
      modalConfig: {
        template: rcloneTemplate,
        controller: rcloneController,
        controllerAs: '$ctrl',
        resolve: {
          openstackUser() {
            return currentUser;
          },
        },
      },
    });
  };

  self.generateToken = function generateToken(currentUser) {
    CucControllerHelper.modal.showModal({
      modalConfig: {
        template: tokenTemplate,
        controller: tokenController,
        controllerAs: 'CloudProjectOpenstackUsersTokenCtrl',
        resolve: {
          openstackUser: () => currentUser,
        },
      },
    });
  };
  self.openAddUser = function openAddUser() {
    CucControllerHelper.modal.showModal({
      modalConfig: {
        template: addTemplate,
        controller: addController,
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => self.projectId,
        },
      },
      successHandler: () => self.getUsers(),
    });
  };
  self.openDeleteUser = function openDeleteUser(currentUser) {
    CucControllerHelper.modal.showModal({
      modalConfig: {
        template: deleteTemplate,
        controller: deleteController,
        controllerAs: 'CloudProjectOpenStackUserDeleteCtrl',
        resolve: {
          openstackUser: () => currentUser,
          serviceName: () => self.projectId,
        },
      },
      successHandler: () => {
        self.removeFromList(currentUser);
        CucCloudMessage.success($translate.instant('openstackusers_users_delete_success', currentUser));
      },
      errorHandler: err => CucCloudMessage.error([$translate.instant('openstackusers_users_delete_error'), (err.data && err.data.message) || ''].join(' ')),
    });
  };

  // Open Openstack Horizon in a new navigator window, pre-filling the user login
  self.openHorizon = function openHorizon(user) {
    $window.open(PCI_REDIRECT_URLS[TARGET].horizon.replace('{username}', user.username), '_blank');
  };

  self.getPassword = function getPassword(currentUser) {
    return OpenstackUsersPassword.get(self.projectId, currentUser.id);
  };

  self.removeFromList = function removeFromList(user) {
    const index = findIndex(self.table.users, { id: user.id });
    if (index !== -1) {
      self.table.users.splice(index, 1);
    }
  };

  init();
}
