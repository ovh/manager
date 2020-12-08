import find from 'lodash/find';

export default class DedicatedAccountContactsRequestReceivedCtrl {
  /* @ngInject */
  constructor($scope, $translate, Contacts, Alerter, ducUser) {
    const self = this;

    self.loaders = {
      tasks: false,
    };

    function getUser() {
      return ducUser.getUser().then(
        (user) => {
          self.user = user;
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
      self.contactTasksIds = [];
      self.contactTasksDetails = [];
      getUser().then(() => {
        self.getContactChangeTasks();
      });
    }

    self.getContactChangeTasks = function getContactChangeTasks() {
      self.loaders.tasks = true;
      self.contactTasksIds = [];
      self.contactTasksDetails = [];
      return Contacts.getContactChangeTasks({
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
      return Contacts.getContactChangeTaskDetail(id);
    };

    self.onTransformItemDone = function onTransformItemDone() {
      self.loaders.tasks = false;
      setTimeout(() => {
        Contacts.killAllPolling({
          namespace: 'user.contacts.receivedRequest',
        });
        Contacts.killAllPolling({
          namespace: 'user.contacts.received.poll',
        });

        const pendingChanges = Contacts.getPendingChanges({
          key: 'Contacts::PendingChangeSent',
        });
        if (pendingChanges) {
          pendingChanges.forEach((pending) => {
            if (pending.split('_')[0] === self.user.nichandle) {
              Contacts.pollState({
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
                Contacts.pollState({
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
                Contacts.pollState({
                  id: task.id,
                  successSates: ['done', 'refused'],
                  namespace: 'user.contacts.received.poll',
                });
                break;
              case 'checkValidity':
                Contacts.pollState({
                  id: task.id,
                  successSates: ['validatingByCustomers', 'doing'],
                  namespace: 'user.contacts.received.poll',
                });
                break;
              case 'validatingByCustomers':
                Contacts.pollState({
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
      Contacts.removePendingChange({
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
        Contacts.pollState({
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
      Contacts.killAllPolling({
        namespace: 'user.contacts.receivedRequest',
      });
      Contacts.killAllPolling({ namespace: 'user.contacts.received.poll' });
    });

    init();
  }
}
