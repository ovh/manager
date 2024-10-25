import find from 'lodash/find';

export default /* @ngInject */ function UserAccountContactsRequestReceivedController(
  $scope,
  $translate,
  UserAccountContactsService,
  Alerter,
  coreConfig,
) {
  const self = this;

  self.loaders = {
    tasks: false,
  };

  self.user = coreConfig.getUser();

  function init() {
    self.contactTasksIds = [];
    self.contactTasksDetails = [];
    self.getContactChangeTasks();
  }

  self.getContactChangeTasks = function getContactChangeTasks() {
    self.loaders.tasks = true;
    self.contactTasksIds = [];
    self.contactTasksDetails = [];
    return UserAccountContactsService.getContactChangeTasks({
      toAccount: self.user.nichandle,
    })
      .then(
        (tasks) => {
          // eslint-disable-next-line no-multi-assign
          self.contactTasksIds = self.contactTasksIds = tasks
            .sort((a, b) => {
              if (a < b) {
                return -1;
              }
              if (a > b) {
                return 1;
              }
              return 0;
            })
            .reverse();
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
        namespace: 'user.contacts.receivedRequest',
      });
      UserAccountContactsService.killAllPolling({
        namespace: 'user.contacts.received.poll',
      });

      const pendingChanges = UserAccountContactsService.getPendingChanges({
        key: 'Contacts::PendingChangeSent',
      });
      if (pendingChanges) {
        pendingChanges.forEach((pending) => {
          if (pending.split('_')[0] === self.user.nichandle) {
            UserAccountContactsService.pollState({
              namespace: 'user.contacts.receivedRequest',
              id: pending.split('_')[1],
              successSates: ['doing', 'refused', 'aborted'],
            });
          }
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
                namespace: 'user.contacts.received.poll',
              });
              break;
            case 'doing':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['done', 'refused'],
                namespace: 'user.contacts.received.poll',
              });
              break;
            case 'checkValidity':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['validatingByCustomers', 'doing'],
                namespace: 'user.contacts.received.poll',
              });
              break;
            case 'validatingByCustomers':
              UserAccountContactsService.pollState({
                id: task.id,
                successSates: ['doing', 'refused'],
                namespace: 'user.contacts.received.poll',
              });
              break;
            default:
              break;
          }
        }
      });
    }, 0);
  };

  $scope.$on('user.contacts.receivedRequest.start', (pollObject, id) => {
    const contactChange = find(
      self.contactTasksDetails,
      (_contactChange) => _contactChange.id === parseInt(id, 10),
    );

    if (contactChange) {
      contactChange.hasPendingChange = true;
    }
  });

  $scope.$on('user.contacts.receivedRequest.done', (pollObject, task) => {
    UserAccountContactsService.removePendingChange({
      key: 'Contacts::PendingChangeSent',
      data: [self.user.nichandle, task.id].join('_'),
    });
    const contactChange = find(
      self.contactTasksDetails,
      (_contactChange) => _contactChange.id === task.id,
    );

    if (contactChange) {
      if (contactChange.state === 'doing') {
        self.getContactChangeTasks();
        return;
      }
      contactChange.hasPendingChange = true;
      contactChange.state = 'doing';
      UserAccountContactsService.pollState({
        namespace: 'user.contacts.received.poll',
        id: contactChange.id,
        successSates: ['done', 'refused'],
      });
    }
  });

  $scope.$on('user.contacts.received.poll.done', () => {
    self.getContactChangeTasks();
  });

  $scope.$on('useraccount.contact.request.changed', () => {
    self.getContactChangeTasks();
  });

  $scope.$on('$destroy', () => {
    UserAccountContactsService.killAllPolling({
      namespace: 'user.contacts.receivedRequest',
    });
    UserAccountContactsService.killAllPolling({
      namespace: 'user.contacts.received.poll',
    });
  });

  init();
}
