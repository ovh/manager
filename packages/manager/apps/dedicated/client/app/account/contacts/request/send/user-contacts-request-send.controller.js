import find from 'lodash/find';

export default class DedicatedAccountContactsRequestSendCtrl {
  /* @ngInject */
  constructor($scope, $translate, Contacts, Alerter, ducUser) {
    const self = this;
    self.contactTasksDetails = [];

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
      self.addMode = false;
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
        askingAccount: self.user.nichandle,
      })
        .then(
          (tasks) => {
            self.contactTasksIds = tasks
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
        Contacts.killAllPolling({ namespace: 'user.contacts.sendRequest' });
        Contacts.killAllPolling({ namespace: 'user.contacts.send.poll' });

        const pendingChanges = Contacts.getPendingChanges({
          key: 'Contacts::PendingChangeSent',
        });
        if (pendingChanges) {
          pendingChanges.forEach((pending) => {
            Contacts.pollState({
              namespace: 'user.contacts.sendRequest',
              id: pending.split('_')[1],
              successSates: ['doing', 'refused', 'aborted'],
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
                Contacts.pollState({
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
                Contacts.pollState({
                  id: task.id,
                  successSates: ['done', 'refused'],
                  namespace: 'user.contacts.send.poll',
                });
                break;
              case 'checkValidity':
                Contacts.pollState({
                  id: task.id,
                  successSates: ['validatingByCustomers', 'doing'],
                  namespace: 'user.contacts.send.poll',
                });
                break;
              case 'validatingByCustomers':
                Contacts.pollState({
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
          namespace: 'user.contacts.send.poll',
          id: contactChange.id,
          successSates: ['done', 'refused'],
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
      Contacts.killAllPolling({ namespace: 'user.contacts.sendRequest' });
      Contacts.killAllPolling({ namespace: 'user.contacts.send.poll' });
    });

    init();
  }
}
