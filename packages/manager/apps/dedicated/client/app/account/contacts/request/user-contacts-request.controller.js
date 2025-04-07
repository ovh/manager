import filter from 'lodash/filter';
import find from 'lodash/find';
import size from 'lodash/size';

export default /* @ngInject */ function UserAccountContactsRequestsController(
  $scope,
  UserAccountContactsService,
  Alerter,
  $stateParams,
  $translate,
  coreConfig,
) {
  const self = this;
  self.contactTasksDetails = [];
  self.hasToken = false;

  self.loaders = {
    init: false,
    tasks: false,
  };

  self.user = coreConfig.getUser();

  function getTaskStateEnum() {
    return UserAccountContactsService.getTaskStateEnum().then(
      (states) => {
        self.taskStateEnum = states;
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('user_account_contacts_error'),
          err,
          'useraccount.alerts.dashboardContacts',
        );
      },
    );
  }

  function init() {
    self.loaders.init = true;
    self.addMode = false;
    self.contactTasksDetails = [];
    getTaskStateEnum()
      .then(() => {
        if ($stateParams.taskId) {
          self.contactTasksIds = [$stateParams.taskId];
          self.hasToken = true;
          self.selectedState = 'validatingByCustomers';
        } else {
          self.getContactChangeTasks();
        }
      })
      .finally(() => {
        self.loaders.init = false;
      });
  }

  self.getContactChangeTasks = function getContactChangeTasks() {
    const params = {};
    self.loaders.tasks = true;
    self.contactTasksIds = [];
    self.contactTasksDetails = [];
    if (self.selectedState) {
      params.state = self.selectedState;
    }
    return UserAccountContactsService.getContactChangeTasks(params)
      .then(
        (tasks) => {
          self.contactTasksIds = tasks.sort().reverse();
        },
        (err) => {
          Alerter.alertFromSWS(
            $translate.instant('user_account_contacts_error'),
            err,
            'useraccount.alerts.dashboardContacts',
          );
        },
      )
      .finally(() => {
        self.loaders.tasks = false;
      });
  };

  self.transformItem = function transformItem(id) {
    self.loaders.tasks = true;
    return UserAccountContactsService.getContactChangeTaskDetail(id);
  };

  self.onTransformItemDone = function onTransformItemDone() {
    self.loaders.tasks = false;
    setTimeout(() => {
      UserAccountContactsService.killAllPolling({
        namespace: 'user.contacts.sendRequest',
      });
      UserAccountContactsService.killAllPolling({
        namespace: 'user.contacts.send.poll',
      });

      const pendingChanges = filter(
        UserAccountContactsService.getPendingChanges({
          key: 'Contacts::PendingChangeSent',
        }),
        (value) => {
          const splittedValue = value.split('_');
          return (
            size(splittedValue) && splittedValue[0] === self.user.nichandle
          );
        },
      );

      if (pendingChanges) {
        pendingChanges.forEach((pending) => {
          UserAccountContactsService.pollState({
            namespace: 'user.contacts.sendRequest',
            id: pending.split('_')[1],
            successSates: ['doing', 'refused', 'aborted', 'done'],
          });
        });
      }

      self.contactTasksDetails.forEach((task) => {
        if (
          pendingChanges.indexOf([self.user.nichandle, task.id].join('_')) ===
          -1
        ) {
          switch (task.state) {
            case 'todo':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: [
                  'validatingByCustomers',
                  'checkValidity',
                  'refused',
                ],
                namespace: 'user.contacts.send.poll',
              });
              break;
            case 'doing':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['done', 'refused'],
                namespace: 'user.contacts.send.poll',
              });
              break;
            case 'checkValidity':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['validatingByCustomers', 'doing'],
                namespace: 'user.contacts.send.poll',
              });
              break;
            case 'validatingByCustomers':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['doing', 'refused'],
                namespace: 'user.contacts.send.poll',
              });
              break;
            default:
              break;
          }
        }
      });
    }, 0);
  };

  self.onTaskStateChanged = function onTaskStateChanged() {
    self.getContactChangeTasks();
  };

  $scope.$on('user.contacts.sendRequest.start', (pollObject, id) => {
    angular.noop(pollObject);
    const contactChange = find(
      self.contactTasksDetails,
      (contact) => contact.id === parseInt(id, 10),
    );

    if (contactChange) {
      contactChange.hasPendingChange = true;
    }
  });

  $scope.$on('user.contacts.sendRequest.done', (pollObject, task) => {
    angular.noop(pollObject);
    UserAccountContactsService.removePendingChange({
      key: 'Contacts::PendingChangeSent',
      data: [self.user.nichandle, task.id].join('_'),
    });

    const contactChange = find(self.contactTasksDetails, { id: task.id });

    if (contactChange) {
      if (contactChange.state === 'doing') {
        self.getContactChangeTasks();
        return;
      }
      contactChange.hasPendingChange = true;
      contactChange.state = 'doing';
      UserAccountContactsService.pollState({
        namespace: 'user.contacts.send.poll',
        id: contactChange.id,
        successSates: ['done', 'refused'],
      });
    }
  });

  $scope.$on('user.contacts.sendRequest.error', (pollObject, task, opts) => {
    angular.noop(pollObject);
    if (task && task.status && task.status === 404) {
      UserAccountContactsService.removePendingChange({
        key: 'Contacts::PendingChangeSent',
        data: [self.user.nichandle, opts.id].join('_'),
      });
    }
  });

  $scope.$on('user.contacts.send.poll.done', () => {
    self.getContactChangeTasks();
  });

  $scope.$on('useraccount.contact.request.changed', () => {
    self.getContactChangeTasks();
  });

  $scope.$on('$destroy', () => {
    UserAccountContactsService.killAllPolling({
      namespace: 'user.contacts.sendRequest',
    });
    UserAccountContactsService.killAllPolling({
      namespace: 'user.contacts.send.poll',
    });
  });

  init();
}
